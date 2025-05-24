import React, { useState } from "react";
import axios from "axios";
import TextEditor from "./TextEditor";

interface Subsection {
  title: string;
  body: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  title: string;
  description: string;
  questions: Question[];
}

interface CreateModuleProps {
  onModuleCreated?: () => void;
  setCreateModule: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateModule: React.FC<CreateModuleProps> = ({ onModuleCreated, setCreateModule }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmSubsection, setDeleteConfirmSubsection] = useState<{index: number, title: string} | null>(null);
  const [deleteConfirmQuiz, setDeleteConfirmQuiz] = useState<{index: number, title: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'subsections' | 'quizzes'>('subsections');

  const handleSubsectionChange = (index: number, field: keyof Subsection, value: string) => {
    setSubsections((prev) =>
      prev.map((subsection, i) =>
        i === index ? { ...subsection, [field]: value } : subsection
      )
    );
  };

  const handleAddSubsection = () => {
    setSubsections([...subsections, { 
      title: "New Subsection", 
      body: "<p>Enter content here...</p>" // Changed from plain text to HTML
    }]);
};

  const handleDeleteSubsection = (index: number) => {
    setSubsections(subsections.filter((_, i) => i !== index));
    setDeleteConfirmSubsection(null);
  };

  const handleAddQuiz = () => {
    setQuizzes([...quizzes, { 
      title: "New Quiz", 
      description: "Quiz description...",
      questions: [{
        question: "Enter your question here",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: "Option 1"
      }]
    }]);
  };

  const handleDeleteQuiz = (index: number) => {
    setQuizzes(quizzes.filter((_, i) => i !== index));
    setDeleteConfirmQuiz(null);
  };

  const handleQuizChange = (index: number, field: keyof Omit<Quiz, 'questions'>, value: string) => {
    setQuizzes((prev) =>
      prev.map((quiz, i) =>
        i === index ? { ...quiz, [field]: value } : quiz
      )
    );
  };

  const handleQuestionChange = (quizIndex: number, questionIndex: number, field: keyof Question, value: string | string[]) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz, qIdx) => {
        if (qIdx !== quizIndex) return quiz;
        
        const updatedQuestions = quiz.questions.map((question, idx) => {
          if (idx !== questionIndex) return question;
          return { ...question, [field]: value };
        });
        
        return { ...quiz, questions: updatedQuestions };
      })
    );
  };

  const handleOptionChange = (quizIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz, qIdx) => {
        if (qIdx !== quizIndex) return quiz;
        
        const updatedQuestions = quiz.questions.map((question, idx) => {
          if (idx !== questionIndex) return question;
          
          const newOptions = [...question.options];
          newOptions[optionIndex] = value;
          
          let correctAnswer = question.correctAnswer;
          if (correctAnswer === question.options[optionIndex]) {
            correctAnswer = value;
          }
          
          return { ...question, options: newOptions, correctAnswer };
        });
        
        return { ...quiz, questions: updatedQuestions };
      })
    );
  };

  const handleCorrectAnswerChange = (quizIndex: number, questionIndex: number, value: string) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz, qIdx) => {
        if (qIdx !== quizIndex) return quiz;
        
        const updatedQuestions = quiz.questions.map((question, idx) => {
          if (idx !== questionIndex) return question;
          return { ...question, correctAnswer: value };
        });
        
        return { ...quiz, questions: updatedQuestions };
      })
    );
  };

  const handleAddQuestion = (quizIndex: number) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz, idx) => {
        if (idx !== quizIndex) return quiz;
        
        return {
          ...quiz,
          questions: [
            ...quiz.questions,
            {
              question: "Enter your question here",
              options: ["Option 1", "Option 2", "Option 3", "Option 4"],
              correctAnswer: "Option 1"
            }
          ]
        };
      })
    );
  };

  const handleRemoveQuestion = (quizIndex: number, questionIndex: number) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz, idx) => {
        if (idx !== quizIndex) return quiz;
        
        return {
          ...quiz,
          questions: quiz.questions.filter((_, qIdx) => qIdx !== questionIndex)
        };
      })
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const moduleData = {
      title,
      description,
    };

    try {
      const token = localStorage.getItem("authToken");
      
      const moduleResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/modules`, 
        moduleData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const moduleId = moduleResponse.data.id || moduleResponse.data._id;
      
      if (subsections.length > 0) {
        await Promise.all(
          subsections.map(subsection => 
            axios.post(
              `${process.env.REACT_APP_API_URL}/api/modules/${moduleId}`, 
              {
                title: subsection.title,
                body: subsection.body,
                authorID: "system"
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )
          )
        );
      }
      
      if (quizzes.length > 0) {
        await Promise.all(
          quizzes.map(async (quiz) => {
            const quizResponse = await axios.post(
              `${process.env.REACT_APP_API_URL}/api/modules/${moduleId}/quiz`,
              {
                title: quiz.title,
                description: quiz.description
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            
            const quizId = quizResponse.data._id;
            
            if (quiz.questions.length > 0) {
              await Promise.all(
                quiz.questions.map(question =>
                  axios.post(
                    `${process.env.REACT_APP_API_URL}/api/modules/quiz/${quizId}`,
                    {
                      question: question.question,
                      options: question.options,
                      correctAnswer: question.correctAnswer
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    }
                  )
                )
              );
            }
          })
        );
      }
      
      setSuccess("Module created successfully!");
      setError(null);
      if (onModuleCreated) onModuleCreated();
    } catch (error: any) {
      setError("Error creating module: " + (error.response?.data?.message || error.message));
      setSuccess(null);
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Module</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold w-full p-2 border border-gray-300 rounded"
            placeholder="Enter module title"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-24 p-2 border border-gray-300 rounded"
            placeholder="Enter module description"
            required
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <h3>Subsections</h3>
          {subsections.map((subsection, index) => (
            <div key={index} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label>Title:</label>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmSubsection({index, title: subsection.title})}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    padding: "0.2rem 0.5rem",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Delete Subsection
                </button>
              </div>
              <input
                type="text"
                value={subsection.title}
                onChange={(e) => handleSubsectionChange(index, "title", e.target.value)}
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />
              <div>
                <label>Body:</label>
                <textarea
                  value={subsection.body}
                  onChange={(e) => handleSubsectionChange(index, "body", e.target.value)}
                  style={{ width: "100%", height: "80px" }}
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddSubsection}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              marginTop: "1rem",
              width: "100%"
            }}
          >
            Add Subsection
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white border-none py-2 px-4 rounded cursor-pointer"
          >
            Create Module
          </button>
        </div>
      </form>

      {error && <div className="text-red-500 mt-4">{error}</div>}
      {success && <div className="text-green-500 mt-4">{success}</div>}

      {deleteConfirmSubsection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-11/12 max-w-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-3">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete the subsection "{deleteConfirmSubsection.title}"?</p>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => handleDeleteSubsection(deleteConfirmSubsection.index)}
                className="bg-red-600 text-white border-none rounded py-2 px-4 cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirmSubsection(null)}
                className="bg-gray-500 text-white border-none rounded py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {deleteConfirmQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-11/12 max-w-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-3">Confirm Deletion</h2>
            <p className="mb-2">Are you sure you want to delete the quiz "{deleteConfirmQuiz.title}"?</p>
            <p className="text-red-600 font-bold mb-4">
              This action will also delete all questions and cannot be undone.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => handleDeleteQuiz(deleteConfirmQuiz.index)}
                className="bg-red-600 text-white border-none rounded py-2 px-4 cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirmQuiz(null)}
                className="bg-gray-500 text-white border-none rounded py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateModule;