// src/pages/CreateModule.tsx
import React, { useState } from "react";
import TextEditor from "../components/TextEditor";
import api from "../lib/api";

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

const CreateModule: React.FC<CreateModuleProps> = ({
  onModuleCreated,
  setCreateModule,
}) => {
  // ---- 1) 基本 State ----
  const [title, setTitle] = useState("");
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeTab, setActiveTab] = useState<"subsections" | "quizzes">(
    "subsections"
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---- 2) Subsection 操作 ----
  const handleSubsectionChange = (
    idx: number,
    field: keyof Subsection,
    value: string
  ) => {
    setSubsections((prev) =>
      prev.map((sub, i) =>
        i === idx ? { ...sub, [field]: value } : sub
      )
    );
  };
  const handleAddSubsection = () => {
    setSubsections((prev) => [
      ...prev,
      { title: "New Subsection", body: "<p>Enter content here...</p>" },
    ]);
  };
  const handleDeleteSubsection = (idx: number) => {
    setSubsections((prev) => prev.filter((_, i) => i !== idx));
  };

  // ---- 3) Quiz 操作 ----
  const handleAddQuiz = () => {
    setQuizzes((prev) => [
      ...prev,
      {
        title: "New Quiz",
        description: "Quiz description...",
        questions: [
          {
            question: "Enter your question here",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: "Option 1",
          },
        ],
      },
    ]);
  };
  const handleDeleteQuiz = (idx: number) => {
    setQuizzes((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleQuizChange = (
    qIdx: number,
    field: keyof Omit<Quiz, "questions">,
    value: string
  ) => {
    setQuizzes((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, [field]: value } : q))
    );
  };
  const handleQuestionChange = (
    qIdx: number,
    quesIdx: number,
    field: keyof Question,
    value: string | string[]
  ) => {
    setQuizzes((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const questions = q.questions.map((ques, j) =>
          j === quesIdx ? { ...ques, [field]: value } : ques
        );
        return { ...q, questions };
      })
    );
  };
  const handleOptionChange = (
    qIdx: number,
    quesIdx: number,
    optIdx: number,
    value: string
  ) => {
    setQuizzes((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const questions = q.questions.map((ques, j) => {
          if (j !== quesIdx) return ques;
          const options = [...ques.options];
          options[optIdx] = value;
          let correctAnswer = ques.correctAnswer;
          if (correctAnswer === ques.options[optIdx]) {
            correctAnswer = value;
          }
          return { ...ques, options, correctAnswer };
        });
        return { ...q, questions };
      })
    );
  };
  const handleCorrectAnswerChange = (
    qIdx: number,
    quesIdx: number,
    value: string
  ) => {
    setQuizzes((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const questions = q.questions.map((ques, j) =>
          j === quesIdx ? { ...ques, correctAnswer: value } : ques
        );
        return { ...q, questions };
      })
    );
  };
  const handleAddQuestion = (qIdx: number) => {
    setQuizzes((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        return {
          ...q,
          questions: [
            ...q.questions,
            {
              question: "Enter your question here",
              options: ["Option 1", "Option 2", "Option 3", "Option 4"],
              correctAnswer: "Option 1",
            },
          ],
        };
      })
    );
  };
  const handleRemoveQuestion = (qIdx: number, quesIdx: number) => {
    setQuizzes((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        return {
          ...q,
          questions: q.questions.filter((_, j) => j !== quesIdx),
        };
      })
    );
  };

  // ---- 4) 提交 ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      // 1) 创建 Module
      const resMod = await api.post(
        `/modules`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const moduleId = resMod.data.id || resMod.data._id;

      // 2) 批量创建 Subsections
      if (subsections.length) {
        await Promise.all(
          subsections.map((s) =>
            api.post(
              `/modules/${moduleId}`,
              { title: s.title, body: s.body, authorID: "system" },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
      }

      // 3) 批量创建 Quizzes & Questions
      if (quizzes.length) {
        await Promise.all(
          quizzes.map(async (quiz) => {
            const resQuiz = await api.post(
              `/modules/${moduleId}/quiz`,
              { title: quiz.title, description: quiz.description },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const quizId = resQuiz.data._id;
            if (quiz.questions.length) {
              await Promise.all(
                quiz.questions.map((ques) =>
                  api.post(
                    `/modules/quiz/${quizId}`,
                    {
                      question: ques.question,
                      options: ques.options,
                      correctAnswer: ques.correctAnswer,
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                  )
                )
              );
            }
          })
        );
      }

      setSuccess("Module created successfully!");
      setError(null);
      onModuleCreated?.();
    } catch (err: any) {
      setError("Error creating module: " + err.message);
      setSuccess(null);
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Module</h1>
      <form onSubmit={handleSubmit}>
        {/* Module Title */}
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter module title"
            required
          />
        </div>

        {/* Tab 切换 */}
        <div className="flex mb-4 border-b">
          <div
            onClick={() => setActiveTab("subsections")}
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "subsections"
                ? "font-bold border-b-2 border-blue-500"
                : ""
            }`}
          >
            Subsections
          </div>
          <div
            onClick={() => setActiveTab("quizzes")}
            className={`px-4 py-2 cursor-pointer ${
              activeTab === "quizzes"
                ? "font-bold border-b-2 border-blue-500"
                : ""
            }`}
          >
            Quizzes
          </div>
        </div>

        {/* Subsections 区域（HEAD 版样式） */}
        {activeTab === "subsections" && (
          <div style={{ marginBottom: 24 }}>
            <h3>Subsections</h3>
            {subsections.map((sub, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: 5,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <label>Title:</label>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubsection(idx)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      padding: "0.2rem 0.5rem",
                      borderRadius: 3,
                    }}
                  >
                    Delete
                  </button>
                </div>
                <input
                  type="text"
                  value={sub.title}
                  onChange={(e) =>
                    handleSubsectionChange(idx, "title", e.target.value)
                  }
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                />
                <div>
                  <label>Body:</label>
                  <TextEditor
                    content={sub.body}
                    onChange={(html) =>
                      handleSubsectionChange(idx, "body", html)
                    }
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSubsection}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              + Add Subsection
            </button>
          </div>
        )}

        {/* Quizzes 区域（main 版样式） */}
        {activeTab === "quizzes" && (
          <div style={{ marginBottom: 24 }}>
            <h3 className="text-xl mb-2">Quizzes</h3>
            {quizzes.map((quiz, qi) => (
              <div
                key={qi}
                className="mb-6 border p-4 rounded"
              >
                <div className="flex justify-between mb-2">
                  <input
                    type="text"
                    value={quiz.title}
                    onChange={(e) =>
                      handleQuizChange(qi, "title", e.target.value)
                    }
                    className="flex-1 p-2 border rounded"
                    placeholder="Quiz title"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteQuiz(qi)}
                    className="ml-2 bg-red-500 text-white px-2 rounded"
                  >
                    Delete
                  </button>
                </div>
                <textarea
                  value={quiz.description}
                  onChange={(e) =>
                    handleQuizChange(qi, "description", e.target.value)
                  }
                  className="w-full p-2 border rounded mb-4"
                  placeholder="Quiz description…"
                />
                {quiz.questions.map((ques, qi2) => (
                  <div key={qi2} className="mb-4 border p-3 rounded">
                    <div className="flex justify-between mb-2">
                      <strong>Question {qi2 + 1}</strong>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveQuestion(qi, qi2)
                        }
                        className="bg-red-500 text-white px-2 rounded"
                      >
                        Delete
                      </button>
                    </div>
                    <input
                      type="text"
                      value={ques.question}
                      onChange={(e) =>
                        handleQuestionChange(
                          qi,
                          qi2,
                          "question",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded mb-2"
                      placeholder="Enter question"
                    />
                    {ques.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center mb-2">
                        <input
                          type="radio"
                          name={`correct-${qi}-${qi2}`}
                          checked={ques.correctAnswer === opt}
                          onChange={() =>
                            handleCorrectAnswerChange(qi, qi2, opt)
                          }
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(qi, qi2, oi, e.target.value)
                          }
                          className="flex-1 p-2 border rounded"
                          placeholder={`Option ${oi + 1}`}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddQuestion(qi)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      + Add Question
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddQuiz}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  + Add Quiz
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit / Cancel */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => setCreateModule(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Module
          </button>
        </div>
      </form>

      {/* 成功 / 错误 信息 */}
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {success && <div className="text-green-500 mt-4">{success}</div>}
    </div>
  );
};

export default CreateModule;
