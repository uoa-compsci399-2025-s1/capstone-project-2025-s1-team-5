import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Module, Subsection, Question, Quiz } from '../types/interfaces';

interface EditModuleFormProps {
  module: Module;
  onModuleUpdated: () => void;
  setEditModule: React.Dispatch<React.SetStateAction<Module | null>>;
}

const EditModuleForm: React.FC<EditModuleFormProps> = ({ module, onModuleUpdated, setEditModule }) => {
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description);
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [moduleSubsectionIds, setModuleSubsectionIds] = useState<string[]>(module.subsectionIds || []);
  const [moduleQuizIds, setModuleQuizIds] = useState<string[]>(module.quizIds || []);
  const [deleteConfirmSubsection, setDeleteConfirmSubsection] = useState<Subsection | null>(null);
  const [deleteConfirmQuiz, setDeleteConfirmQuiz] = useState<Quiz | null>(null);
  const [activeTab, setActiveTab] = useState<'subsections' | 'quizzes'>('subsections');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getModuleId = () => {
    return module._id || '';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (moduleSubsectionIds.length > 0) {
          const subsectionPromises = moduleSubsectionIds.map(id =>
            axios.get<Subsection>(`${process.env.REACT_APP_API_URL}/api/modules/subsection/${id}`)
          );
          const subsectionResponses = await Promise.all(subsectionPromises);
          const fetchedSubsections = subsectionResponses.map(res => res.data);
          setSubsections(fetchedSubsections);
        }

        if (moduleQuizIds && moduleQuizIds.length > 0) {
          const quizPromises = moduleQuizIds.map(id =>
            axios.get<Quiz>(`${process.env.REACT_APP_API_URL}/api/modules/quiz/${id}`)
          );
          const quizResponses = await Promise.all(quizPromises);
          const fetchedQuizzes = quizResponses.map(res => res.data);
          console.log("Fetched quizzes:", fetchedQuizzes);
          setQuizzes(fetchedQuizzes);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setError("Failed to load module data. Please try again.");
      }
    };

    fetchData();
  }, [moduleSubsectionIds, moduleQuizIds]);

  const handleSubsectionChange = (_id: string, field: keyof Subsection, value: string) => {
    setSubsections((prev) =>
      prev.map((subsection) =>
        subsection._id === _id ? { ...subsection, [field]: value } : subsection
      )
    );
  };

  const handleAddSubsection = async () => {
    try {
      const newSubsectionData = {
        title: "New Subsection",
        body: "Enter content here...",
        authorID: "system"
      };
      
      const response = await axios.post(
        `http://localhost:3000/modules/${module.id}`, 
        newSubsectionData
      );
      
      const newSubsectionId = response.data._id.toString();
      
      const newSubsection = response.data;
      setSubsections([...subsections, newSubsection]);
      setModuleSubsectionIds([...moduleSubsectionIds, newSubsection._id]);
      setSuccess("Subsection added successfully");
      setError(null);
    } catch (error) {
      console.error("Failed to add subsection:", error);
      setError("Failed to add subsection");
      setSuccess(null);
    }
  };

  const handleDeleteSubsection = async (subsectionId: string) => {
    try {
      if (!subsectionId) {
        setError("Cannot delete subsection: Subsection ID is missing");
        return;
      }

      const moduleId = getModuleId();
      if (!moduleId) {
        setError("Cannot delete subsection: Module ID is missing");
        return;
      }

      const token = localStorage.getItem("authToken");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/modules/${moduleId}/${subsectionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSubsections(subsections.filter(s => s._id !== subsectionId));
      setModuleSubsectionIds(moduleSubsectionIds.filter(id => id !== subsectionId));
      setDeleteConfirmSubsection(null);
      setSuccess("Subsection deleted successfully");
      setError(null);
    } catch (error) {
      console.error("Failed to delete subsection:", error);
      setError("Failed to delete subsection");
      setSuccess(null);
    }
  };

  const handleAddQuiz = async () => {
    try {
      const moduleId = getModuleId();
      if (!moduleId) {
        setError("Cannot add quiz: Module ID is missing");
        return;
      }

      const token = localStorage.getItem("authToken");
      const response = await axios.post<Quiz>(
        `${process.env.REACT_APP_API_URL}/api/${moduleId}/quiz`,
        {
          title: "New Quiz",
          description: "Quiz description..."
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const newQuiz = response.data;
      newQuiz.questions = newQuiz.questions || [];
      
      setQuizzes([...quizzes, newQuiz]);
      setModuleQuizIds([...moduleQuizIds, newQuiz._id]);
      setSuccess("Quiz added successfully");
      setError(null);
    } catch (error) {
      console.error("Failed to add quiz:", error);
      setError("Failed to add quiz");
      setSuccess(null);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      if (!quizId) {
        setError("Cannot delete quiz: Quiz ID is missing");
        return;
      }

      const moduleId = getModuleId();
      if (!moduleId) {
        setError("Cannot delete quiz: Module ID is missing");
        return;
      }

      console.log("Deleting quiz with ID:", quizId);
      const token = localStorage.getItem("authToken");
      
      const quizToDelete = quizzes.find(q => q._id === quizId);
      
      if (quizToDelete && quizToDelete.questions && quizToDelete.questions.length > 0) {
        console.log(`Deleting ${quizToDelete.questions.length} questions from quiz ${quizId}`);
        
        for (const question of quizToDelete.questions) {
          if (!question._id) continue;
          
          try {
            console.log(`Deleting question: ${question._id}`);
            await axios.delete(
              `${process.env.REACT_APP_API_URL}/api/modules/quiz/${quizId}/question/${question._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
          } catch (questionError) {
            console.error(`Failed to delete question ${question._id}:`, questionError);
          }
        }
      }
      
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/modules/quiz/${moduleId}/${quizId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setQuizzes(quizzes.filter(q => q._id !== quizId));
      setModuleQuizIds(moduleQuizIds.filter(id => id !== quizId));
      setDeleteConfirmQuiz(null);
      setSuccess("Quiz and all its questions deleted successfully");
      setError(null);
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      setError("Failed to delete quiz");
      setSuccess(null);
    }
  };

  const handleQuizChange = (quizId: string, field: keyof Omit<Quiz, '_id' | 'questions'>, value: string) => {
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz._id === quizId ? { ...quiz, [field]: value } : quiz
      )
    );
  };

  const handleQuestionChange = (quizId: string, questionId: string, field: keyof Omit<Question, '_id'>, value: string | string[]) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz) => {
        if (quiz._id !== quizId) return quiz;
        
        const updatedQuestions = quiz.questions.map((question) => {
          if (question._id !== questionId) return question;
          return { ...question, [field]: value };
        });
        
        return { ...quiz, questions: updatedQuestions };
      })
    );
  };

  const handleOptionChange = (quizId: string, questionId: string, optionIndex: number, value: string) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz) => {
        if (quiz._id !== quizId) return quiz;
        
        const updatedQuestions = quiz.questions.map((question) => {
          if (question._id !== questionId) return question;
          
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

  const handleAddQuestion = async (quizId: string) => {
    try {
      if (!quizId) {
        setError("Cannot add question: Quiz ID is missing");
        return;
      }

      const token = localStorage.getItem("authToken");
      const response = await axios.post<Question>(
        `${process.env.REACT_APP_API_URL}/api/modules/quiz/${quizId}`,
        {
          question: "Enter your question here",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: "Option 1"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const newQuestion = response.data;
      console.log("Added new question:", newQuestion);
      
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) => {
          if (quiz._id !== quizId) return quiz;
          return {
            ...quiz,
            questions: [...quiz.questions, newQuestion]
          };
        })
      );
      setSuccess("Question added successfully");
      setError(null);
    } catch (error) {
      console.error("Failed to add question:", error);
      setError("Failed to add question");
      setSuccess(null);
    }
  };

  const handleRemoveQuestion = async (quizId: string, questionId: string) => {
    try {
      if (!quizId || !questionId) {
        setError("Cannot remove question: Missing quiz ID or question ID");
        return;
      }
      
      console.log("Removing question:", { quizId, questionId });
      
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/modules/quiz/${quizId}/question/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) => {
          if (quiz._id !== quizId) return quiz;
          return {
            ...quiz,
            questions: quiz.questions.filter(q => q._id !== questionId)
          };
        })
      );
      setSuccess("Question removed successfully");
      setError(null);
    } catch (error) {
      console.error("Failed to remove question:", error);
      setError(
        `Failed to remove question: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setSuccess(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const moduleId = getModuleId();
    if (!moduleId) {
      setError("Cannot update module: Module ID is missing");
      return;
    }

    const updatedModule = {
      title,
      description,
      subsectionIds: moduleSubsectionIds,
      quizIds: moduleQuizIds
    };

    try {
      const token = localStorage.getItem("authToken");
      
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/modules/${moduleId}`,
        updatedModule,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      await Promise.all(
        subsections.map(subsection =>
          axios.put(
            `${process.env.REACT_APP_API_URL}/api/modules/subsection/${subsection._id}`,
            {
              title: subsection.title,
              body: subsection.body
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
        )
      );
      
      await Promise.all(
        quizzes.map(async (quiz) => {
          await axios.put(
            `${process.env.REACT_APP_API_URL}/api/modules/quiz/${quiz._id}`,
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
          
          if (quiz.questions && quiz.questions.length > 0) {
            await Promise.all(
              quiz.questions.map(question =>
                axios.patch(
                  `${process.env.REACT_APP_API_URL}/api/modules/question/${question._id}`,
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
      
      setSuccess("Module updated successfully!");
      setError(null);
      onModuleUpdated();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as any)?.response?.data?.message || 'Unknown error occurred';
        
      setError("Error updating module: " + errorMessage);
      setSuccess(null);
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading module data...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Module</h1>
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
          {subsections.map((subsection) => (
            <div key={subsection.id} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label>Title:</label>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmSubsection(subsection)}
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
                onChange={(e) => handleSubsectionChange(subsection.id, "title", e.target.value)}
                style={{ width: "100%", marginBottom: "0.5rem" }}
              />
              <div>
                <label>Body:</label>
                <textarea
                  value={subsection.body}
                  onChange={(e) => handleSubsectionChange(subsection.id, "body", e.target.value)}
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
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            Update Module
          </button>
          <button
            type="button"
            onClick={() => setEditModule(null)}
            className="bg-gray-500 text-white border-none py-2 px-4 rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white border-none py-2 px-4 rounded cursor-pointer"
          >
            Save Changes
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
                onClick={() => handleDeleteSubsection(deleteConfirmSubsection._id)}
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
                onClick={() => handleDeleteQuiz(deleteConfirmQuiz._id)}
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

export default EditModuleForm;