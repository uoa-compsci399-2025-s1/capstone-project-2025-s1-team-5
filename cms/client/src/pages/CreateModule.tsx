import React, { useState } from "react";
import axios from "axios";

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
    setSubsections([...subsections, { title: "New Subsection", body: "Enter content here..." }]);
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
              `http://localhost:3000/modules/${moduleId}/quiz`,
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
                    `http://localhost:3000/modules/quiz/${quizId}`,
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
        
        <div className="flex mb-4 border-b border-gray-300">
          <div 
            onClick={() => setActiveTab('subsections')}
            className={`px-4 py-2 cursor-pointer ${
              activeTab === 'subsections' ? 'font-bold border-b-2 border-blue-500' : 'font-normal'
            }`}
          >
            Subsections
          </div>
          <div 
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2 cursor-pointer ${
              activeTab === 'quizzes' ? 'font-bold border-b-2 border-blue-500' : 'font-normal'
            }`}
          >
            Quizzes
          </div>
        </div>
        
        {activeTab === 'subsections' && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Subsections</h2>
            {subsections.map((subsection, index) => (
              <div key={index} className="mb-6 border border-gray-300 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="text"
                    value={subsection.title}
                    onChange={(e) => handleSubsectionChange(index, "title", e.target.value)}
                    className="text-lg font-bold w-4/5 p-2 border border-gray-300 rounded"
                    placeholder="Subsection title"
                  />
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmSubsection({ index, title: subsection.title })}
                    className="bg-red-500 text-white border-none py-1 px-2 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
                <textarea
                  value={subsection.body}
                  onChange={(e) => handleSubsectionChange(index, "body", e.target.value)}
                  className="w-full min-h-[150px] p-2 border border-gray-300 rounded"
                  placeholder="Subsection content"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSubsection}
              className="bg-green-500 text-white border-none py-2 px-4 rounded cursor-pointer mt-4"
            >
              + Add Subsection
            </button>
          </div>
        )}
        
        {activeTab === 'quizzes' && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Quizzes</h2>
            {quizzes.map((quiz, quizIndex) => (
              <div key={quizIndex} className="mb-6 border border-gray-300 p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="text"
                    value={quiz.title}
                    onChange={(e) => handleQuizChange(quizIndex, "title", e.target.value)}
                    className="text-lg font-bold w-4/5 p-2 border border-gray-300 rounded"
                    placeholder="Quiz title"
                  />
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmQuiz({ index: quizIndex, title: quiz.title })}
                    className="bg-red-500 text-white border-none py-1 px-2 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
                <textarea
                  value={quiz.description}
                  onChange={(e) => handleQuizChange(quizIndex, "description", e.target.value)}
                  className="w-full mb-4 h-20 p-2 border border-gray-300 rounded"
                  placeholder="Quiz description"
                />
                
                <h3 className="font-medium mb-2">Questions</h3>
                {quiz.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="mb-6 border border-gray-300 p-4 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold">Question {questionIndex + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(quizIndex, questionIndex)}
                        className="bg-red-500 text-white border-none py-1 px-2 rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(quizIndex, questionIndex, "question", e.target.value)}
                      className="w-full p-2 mb-4 border border-gray-300 rounded"
                      placeholder="Enter question"
                    />
                    
                    <div className="mb-2">
                      <label className="font-bold block mb-2">Options:</label>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center mb-2">
                          <input
                            type="radio"
                            name={`correct-${quizIndex}-${questionIndex}`}
                            checked={question.correctAnswer === option}
                            onChange={() => handleCorrectAnswerChange(quizIndex, questionIndex, option)}
                            className="mr-2"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(quizIndex, questionIndex, optionIndex, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => handleAddQuestion(quizIndex)}
                  className="bg-blue-500 text-white border-none py-1 px-3 rounded cursor-pointer"
                >
                  + Add Question
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddQuiz}
              className="bg-green-500 text-white border-none py-2 px-4 rounded cursor-pointer mt-4"
            >
              + Add Quiz
            </button>
          </div>
        )}
        
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => setCreateModule(false)}
            className="bg-gray-500 text-white border-none py-2 px-4 rounded cursor-pointer"
          >
            Cancel
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