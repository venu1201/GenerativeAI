from fastapi import FastAPI, File, UploadFile, HTTPException
from tempfile import NamedTemporaryFile
import fitz  # PyMuPDF
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

import os
load_dotenv()
os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
app = FastAPI()


conn = sqlite3.connect('database1.db')
cursor = conn.cursor()
def create_tables():
    # Create table for storing PDFs
    cursor.execute('''CREATE TABLE IF NOT EXISTS pdfs (
                        id INTEGER PRIMARY KEY,
                        filename TEXT NOT NULL,
                        content TEXT NOT NULL
                    )''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS qa (
                        id INTEGER PRIMARY KEY,
                        pdf_id INTEGER,
                        question TEXT NOT NULL,
                        answer TEXT NOT NULL,
                        FOREIGN KEY (pdf_id) REFERENCES pdfs(id)
                    )''')
    conn.commit()
create_tables()
# Allow all origins for simplicity, but you should restrict this to your frontend URL in production
origins = [
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000/upload-pdf/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, Use the content provided and Use your knowledge to answer the question ,
     answer by your own dont copy paste the same from content , don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """

    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)

    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

    return chain

def user_input(user_question,pdf_id):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    filename_with_id = f"{pdf_id}"

    new_db = FAISS.load_local(filename_with_id, embeddings, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)

    chain = get_conversational_chain()

    response = chain(
        {"input_documents": docs, "question": user_question},
        return_only_outputs=True
    )
    answer= response["output_text"]
    cursor.execute('''INSERT INTO qa (pdf_id, question, answer) VALUES (?, ?, ?)''', (pdf_id, user_question, answer))
    conn.commit()

    return answer


@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    if file.filename.endswith(".pdf"):
        # Read the content of the PDF file
        with NamedTemporaryFile(delete=False) as temp_pdf:
            temp_pdf.write(await file.read())
            temp_pdf_name = temp_pdf.name
            # Open the PDF file using PyMuPDF
            pdf_document = fitz.open(temp_pdf_name)
            # Read the content of each page
            content = ""
            for page_num in range(len(pdf_document)):
                page = pdf_document.load_page(page_num)
                content += page.get_text()
            # Close the PDF document
            pdf_document.close()
            cursor.execute('''INSERT INTO pdfs (filename, content) VALUES (?, ?)''', (file.filename, content))
            conn.commit()
            
            # print(content)
           
            text_splitter=RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
            )
            text=text_splitter.split_text(content)
            embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
            vector_store = FAISS.from_texts(text, embedding=embeddings)
            pdf_id = cursor.lastrowid
            filename_with_id = f"{pdf_id}"
            vector_store.save_local(filename_with_id)

            

            # Send response with filename and pdf_id
            return {"message": "PDF successfully uploaded", "filename": file.filename, "pdf_id": pdf_id}

@app.post("/query/")
async def query_document(user_question: dict):
    pdf_id = user_question.get("pdf_id")
    answer = user_input(user_question.get("user_question", ""),pdf_id)
    return {"answer": answer}



def get_questions_and_answers(pdf_id: int):
    cursor.execute("SELECT question, answer FROM qa WHERE pdf_id = ?", (pdf_id,))
    rows = cursor.fetchall()
    if not rows:
        return []
    return [{"question": row[0], "answer": row[1]} for row in rows]

@app.get("/chat/{pdf_id}/", response_model=list[dict])
async def get_pdf_questions_and_answers(pdf_id: int):
    return get_questions_and_answers(pdf_id)


# Define a function to fetch all PDFs with their IDs and filenames
def get_all_pdfs():
    cursor.execute("SELECT id, filename FROM pdfs")
    rows = cursor.fetchall()
    if not rows:
        raise HTTPException(status_code=404, detail="No PDFs found in the database")
    return [{"pdf_id": row[0], "filename": row[1]} for row in rows]

# API endpoint to fetch all PDFs with their IDs and filenames
@app.get("/pdfs/", response_model=list[dict])
async def get_all_pdfs_endpoint():
    return get_all_pdfs()