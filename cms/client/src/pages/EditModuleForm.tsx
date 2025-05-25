import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Module, Subsection, Question, Quiz } from '../types/interfaces';
import TextEditor from './TextEditor';


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
        body: "<p>Enter content here...</p>",
        authorID: "system"
      };
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/modules/${module._id}/subsection`,
        newSubsectionData
      );
   
      const newSubsection = response.data;
      setSubsections(prev => [...prev, newSubsection]);
      setModuleSubsectionIds(prev => [...prev, newSubsection._id]);
      setSuccess("Subsection added successfully");
      setError(null);
    } catch (error) {
      console.error("Failed to add subsection:", error);
      setError(`Failed to add subsection: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      const moduleId = getModuleId();
      const token = localStorage.getItem("authToken");
      
      // Fix the deletion endpoint
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/modules/quiz/${quizId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setQuizzes(prev => prev.filter(q => q._id !== quizId));
      setModuleQuizIds(prev => prev.filter(id => id !== quizId));
      setDeleteConfirmQuiz(null);
      setSuccess("Quiz deleted successfully");
      setError(null);
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      setError(`Failed to delete quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      const token = localStorage.getItem("authToken");
      const response = await axios.post<Question>(
        `${process.env.REACT_APP_API_URL}/api/modules/quiz/${quizId}/question`, // Fixed endpoint
        {
          question: "Enter your question here",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctAnswer: "Option 1"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const newQuestion = response.data;
      setQuizzes(prev => 
        prev.map(quiz => 
          quiz._id === quizId 
            ? { ...quiz, questions: [...quiz.questions, newQuestion] } 
            : quiz
        )
      );
      setSuccess("Question added successfully");
      setError(null);
    } catch (error) {
      console.error("Failed to add question:", error);
      setError(`Failed to add question: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSuccess(null);
    }
  };

  const handleRemoveQuestion = async (quizId: string, questionId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/modules/quiz/${quizId}/question/${questionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setQuizzes((prevQuizzes) =>
        prevQuizzes.map((quiz) => {
          if (quiz._id !== quizId) return quiz;
          return { ...quiz, questions: quiz.questions.filter(q => q._id !== questionId) };
        })
      );
      setSuccess("Question removed successfully");
      setError(null);
    } catch (error) {
      console.error("Failed to remove question:", error);
      setError(`Failed to remove question: ${error instanceof Error ? error.message : String(error)}`);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await Promise.all([
        ...subsections.map(subsection =>
          axios.put(
            `${process.env.REACT_APP_API_URL}/api/modules/subsection/${subsection._id}`,
            { title: subsection.title, body: subsection.body },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ),
        ...quizzes.map(async (quiz) => {
          await axios.put(
            `${process.env.REACT_APP_API_URL}/api/modules/quiz/${quiz._id}`,
            { title: quiz.title, description: quiz.description },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (quiz.questions?.length) {
            await Promise.all(
              quiz.questions.map(question =>
                axios.patch(
                  `${process.env.REACT_APP_API_URL}/api/modules/question/${question._id}`,
                  { question: question.question, options: question.options, correctAnswer: question.correctAnswer },
                  { headers: { Authorization: `Bearer ${token}` } }
                )
              )
            );
          }
        })
      ]);
      
      setSuccess("Module updated successfully!");
      onModuleUpdated();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError("Error updating module: " + errorMessage);
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading module data...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Module</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg text-lg font-semibold"
            placeholder="Module Title"
            required
          />
        </div>
        <div className="mb-6">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg h-32"
            placeholder="Module Description"
            required
          />
        </div>

        <div className="mb-6">
          <div className="flex gap-2 mb-4 border-b">
            <button
              type="button"
              onClick={() => setActiveTab('subsections')}
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === 'subsections' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Subsections
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quizzes')}
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === 'quizzes' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Quizzes
            </button>
          </div>

          {activeTab === 'subsections' && (
            <div>
              {subsections.map((subsection) => (
                <div key={subsection._id} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      value={subsection.title}
                      onChange={(e) => handleSubsectionChange(subsection._id, 'title', e.target.value)}
                      className="w-full p-2 border rounded mr-4"
                      placeholder="Subsection Title"
                    />
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmSubsection(subsection)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <TextEditor
                      content={subsection.body}
                      onChange={(content) => handleSubsectionChange(subsection._id, 'body', content)}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSubsection}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Subsection
              </button>
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div>
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      value={quiz.title}
                      onChange={(e) => handleQuizChange(quiz._id, 'title', e.target.value)}
                      className="w-full p-2 border rounded mr-4"
                      placeholder="Quiz Title"
                    />
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmQuiz(quiz)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  <textarea
                    value={quiz.description}
                    onChange={(e) => handleQuizChange(quiz._id, 'description', e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Quiz Description"
                  />
                  {quiz.questions.map((question) => (
                    <div key={question._id} className="mb-4 p-3 border rounded bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => handleQuestionChange(quiz._id, question._id, 'question', e.target.value)}
                          className="w-full p-2 border rounded mr-2"
                          placeholder="Question"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(quiz._id, question._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {question.options.map((option, index) => (
                          <input
                            key={index}
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(quiz._id, question._id, index, e.target.value)}
                            className="p-2 border rounded"
                            placeholder={`Option ${index + 1}`}
                          />
                        ))}
                      </div>
                      <select
                        value={question.correctAnswer}
                        onChange={(e) => handleQuestionChange(quiz._id, question._id, 'correctAnswer', e.target.value)}
                        className="mt-2 p-2 border rounded w-full"
                      >
                        {question.options.map((option, index) => (
                          <option key={index} value={option}>
                            Option {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddQuestion(quiz._id)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Question
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddQuiz}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Quiz
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => setEditModule(null)}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      {deleteConfirmSubsection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Delete subsection "{deleteConfirmSubsection.title}"?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmSubsection(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSubsection(deleteConfirmSubsection._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-2">Delete quiz "{deleteConfirmQuiz.title}"?</p>
            <p className="mb-6 text-red-600">All questions will be permanently deleted!</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmQuiz(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuiz(deleteConfirmQuiz._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditModuleForm;