import React, { useState } from "react";
import axios from "axios";
import TextEditor from "./TextEditor";
import { Link } from '../types/interfaces';
import { IconPicker } from '../components/IconPicker';

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
  const [iconKey, setIconKey] = useState<string>("");
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmSubsection, setDeleteConfirmSubsection] = useState<{index: number, title: string} | null>(null);
  const [deleteConfirmQuiz, setDeleteConfirmQuiz] = useState<{index: number, title: string} | null>(null);
  const [deleteConfirmLink, setDeleteConfirmLink] = useState<{index: number, title: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'subsections' | 'quizzes' | 'links'>('subsections');

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
      body: "<p>Enter content here...</p>" 
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

  const handleLinkChange = (index: number, field: keyof Link, value: string) => {
    setLinks((prev) =>
      prev.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    );
  };

  const handleAddLink = () => {
    setLinks([...links, { 
      _id: `temp-${Date.now()}`,
      title: "New Link", 
      link: "https://example.com" 
    }]);
  };

  const handleDeleteLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
    setDeleteConfirmLink(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const moduleData = {
      title,
      description,
      iconKey, 
    };

    try {
      const token = localStorage.getItem("authToken");
      const moduleResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/modules`, 
        moduleData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const moduleId = moduleResponse.data.id || moduleResponse.data._id;
      
      if (subsections.length > 0) {
        await Promise.all(
          subsections.map(subsection => 
            axios.post(
              `${process.env.REACT_APP_API_URL}/api/modules/${moduleId}`, 
              { ...subsection, authorID: "system" },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
      }
      
      if (quizzes.length > 0) {
        await Promise.all(
          quizzes.map(async (quiz) => {
            const quizResponse = await axios.post(
              `${process.env.REACT_APP_API_URL}/api/modules/${moduleId}/quiz`,
              { title: quiz.title, description: quiz.description },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            const quizId = quizResponse.data._id;
            
            if (quiz.questions.length > 0) {
              await Promise.all(
                quiz.questions.map(question =>
                  axios.post(
                    `${process.env.REACT_APP_API_URL}/api/modules/quiz/${quizId}`,
                    { ...question },
                    { headers: { Authorization: `Bearer ${token}` } }
                  )
                )
              );
            }
          })
        );
      }

      if (links.length > 0) {
        await Promise.all(
          links.map(link =>
            axios.post(
              `${process.env.REACT_APP_API_URL}/api/modules/link/${moduleId}`,
              { title: link.title, link: link.link },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
      }
      
      setSuccess("Module created successfully!");
      if (onModuleCreated) onModuleCreated();
    } catch (error: any) {
      setError("Error creating module: " + (error.response?.data?.message || error.message));
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Module</h1>
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
          <label className="block mb-2 font-medium">Module Icon</label>
          <IconPicker
            value={iconKey}
            onChange={key => setIconKey(key)}
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
            <button
              type="button"
              onClick={() => setActiveTab('links')}
              className={`px-4 py-2 rounded-t-lg ${
                activeTab === 'links' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Links
            </button>
          </div>

          {activeTab === 'subsections' && (
            <div>
              {subsections.map((subsection, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      value={subsection.title}
                      onChange={(e) => handleSubsectionChange(index, 'title', e.target.value)}
                      className="w-full p-2 border rounded mr-4"
                      placeholder="Subsection Title"
                    />
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmSubsection({index, title: subsection.title})}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <TextEditor
                      key={index}
                      subsectionId={index.toString()}
                      content={subsection.body}
                      onChange={(content) => handleSubsectionChange(index, 'body', content)}
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
              {quizzes.map((quiz, quizIndex) => (
                <div key={quizIndex} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      value={quiz.title}
                      onChange={(e) => handleQuizChange(quizIndex, 'title', e.target.value)}
                      className="w-full p-2 border rounded mr-4"
                      placeholder="Quiz Title"
                    />
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmQuiz({index: quizIndex, title: quiz.title})}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  <textarea
                    value={quiz.description}
                    onChange={(e) => handleQuizChange(quizIndex, 'description', e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Quiz Description"
                  />
                  {quiz.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="mb-4 p-3 border rounded bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => handleQuestionChange(quizIndex, questionIndex, 'question', e.target.value)}
                          className="w-full p-2 border rounded mr-2"
                          placeholder="Question"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(quizIndex, questionIndex)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {question.options.map((option, optionIndex) => (
                          <input
                            key={optionIndex}
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(quizIndex, questionIndex, optionIndex, e.target.value)}
                            className="p-2 border rounded"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        ))}
                      </div>
                      <select
                        value={question.correctAnswer}
                        onChange={(e) => handleCorrectAnswerChange(quizIndex, questionIndex, e.target.value)}
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
                    onClick={() => handleAddQuestion(quizIndex)}
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

          {activeTab === 'links' && (
            <div>
              {links.map((link, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                      className="w-full p-2 border rounded mr-4"
                      placeholder="Link Title"
                    />
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmLink({index, title: link.title})}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  <input
                    type="url"
                    value={link.link}
                    onChange={(e) => handleLinkChange(index, 'link', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Link URL"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddLink}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Link
              </button>
            </div>
          )}

        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => setCreateModule(false)}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Module
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
                onClick={() => handleDeleteSubsection(deleteConfirmSubsection.index)}
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
            <p className="mb-6">Delete quiz "{deleteConfirmQuiz.title}"?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmQuiz(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuiz(deleteConfirmQuiz.index)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">Delete link "{deleteConfirmLink.title}"?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmLink(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLink(deleteConfirmLink.index)}
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

export default CreateModule;