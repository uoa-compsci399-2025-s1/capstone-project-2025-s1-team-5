import React, { useState, useEffect, FormEvent } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api from "../lib/api";
import BlockEditorModal from "./BlockEditorModal";
import { LayoutConfig } from "../components/LayoutEditor";

export interface ModuleType {
  id: string;
  title: string;
  subsectionIds: string[];
  quizIds: string[];
  updatedAt: string;
}

interface Subsection {
  _id: string;
  title: string;
  layout: LayoutConfig;
}

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface EditModuleFormProps {
  module: ModuleType;
  onModuleUpdated: () => void;
  setEditModule: React.Dispatch<React.SetStateAction<ModuleType | null>>;
}

// SubItem component unchanged...
function SubItem({
  sub,
  isEditing,
  editingValue,
  onStartEdit,
  onChangeEdit,
  onSaveEdit,
  onEditContent,
  selected,
  onToggleSelect,
}: {
  sub: { id: string; title: string };
  isEditing: boolean;
  editingValue: string;
  onStartEdit: () => void;
  onChangeEdit: (v: string) => void;
  onSaveEdit: () => void;
  onEditContent: () => void;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sub.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 8,
        padding: 8,
        border: "1px solid #ddd",
        borderRadius: 4,
        backgroundColor: selected ? "#e0f2ff" : "white",
        cursor: "pointer",
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={(e) => {
        if (
          (e.target as HTMLElement).tagName !== "BUTTON" &&
          (e.target as HTMLElement).tagName !== "INPUT" &&
          (e.target as HTMLElement).tagName !== "TEXTAREA"
        ) {
          onToggleSelect();
        }
      }}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab px-2 select-none"
      >
        ☰
      </div>
      <div className="flex-1 px-2">
        {isEditing ? (
          <input
            autoFocus
            value={editingValue}
            onChange={(e) => onChangeEdit(e.target.value)}
            onBlur={onSaveEdit}
            onKeyDown={(e) => e.key === "Enter" && onSaveEdit()}
            className="w-full border-b border-blue-500 focus:outline-none"
          />
        ) : (
          <span onDoubleClick={onStartEdit} className="cursor-pointer">
            {sub.title}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onEditContent}
        className="text-sm text-blue-600 hover:underline"
      >
        Edit Content
      </button>
    </div>
  );
}

export default function EditModuleForm({
  module,
  onModuleUpdated,
  setEditModule,
}: EditModuleFormProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<"subsections" | "quizzes">(
    "subsections"
  );

  // Subsections state
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [order, setOrder] = useState<string[]>(module.subsectionIds);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState<string>("");
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [deleteConfirmSub, setDeleteConfirmSub] = useState<string | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string>(module.title);

  // Quizzes state (from file2)
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [moduleQuizIds, setModuleQuizIds] = useState<string[]>(module.quizIds);
  const [deleteConfirmQuiz, setDeleteConfirmQuiz] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  // Fetch subsections & quizzes
  useEffect(() => {
    // subsections
    Promise.all(order.map((id) => api.get(`/modules/subsection/${id}`)))
      .then((res) => setSubsections(res.map((r) => r.data as Subsection)))
      .catch(console.error);
  
    // quizzes
    if (moduleQuizIds.length) {
      Promise.all(
        moduleQuizIds.map((id) => api.get(`/modules/quiz/${id}`))
      )
        .then((res) => setQuizzes(res.map((r) => r.data as Quiz)))
        .catch(console.error);
    }
    console.log('Fetched quizzes:', moduleQuizIds);
  }, [order, moduleQuizIds]);

  // --- Subsection handlers (unchanged) ---
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setSubsections((list) => {
      const oldIdx = list.findIndex((s) => s._id === active.id);
      const newIdx = list.findIndex((s) => s._id === over.id);
      const newList = arrayMove(list, oldIdx, newIdx);
      setOrder(newList.map((s) => s._id));
      return newList;
    });
  };

  const handleAddSubsection = async () => {
    const res = await api.post(`/modules/${module.id}`, {
      title: "New Subsection",
      authorID: "system",
    });
    const newId = (res.data as any)._id;
    setOrder((o) => [...o, newId]);
  };

  const handleDeleteSubsection = async (id: string) => {
    await api.delete(`/modules/${module.id}/${id}`);
    setOrder((o) => o.filter((x) => x !== id));
    setDeleteConfirmSub(null);
  };

  const saveSubsectionTitle = async (id: string) => {
    await api.put(`/modules/subsection/${id}`, { title: editingTitleValue });
    setSubsections((s) =>
      s.map((x) => (x._id === id ? { ...x, title: editingTitleValue } : x))
    );
    setEditingTitleId(null);
  };

  // --- Quiz handlers (from file2, using api) ---
  const handleAddQuiz = async () => {
    const res = await api.post(`/modules/${module.id}/quiz`, {
      title: "New Quiz",
      description: "",
    });
    const newQuiz = res.data as Quiz;
    newQuiz.questions = newQuiz.questions || [];
    setQuizzes((prev) => [...prev, newQuiz]);
    setModuleQuizIds((prev) => [...prev, newQuiz._id]);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    // delete all questions first
    const quizToDelete = quizzes.find((q) => q._id === quizId);
    if (quizToDelete?.questions?.length) {
      for (const question of quizToDelete.questions) {
        await api.delete(
          `/modules/question/${question._id}`
        );
      }
    }
    await api.delete(`/modules/quiz/${module.id}/${quizId}`);
    setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
    setModuleQuizIds((prev) => prev.filter((id) => id !== quizId));
    setDeleteConfirmQuiz(null);
  };

  const handleQuizChange = (
    quizId: string,
    field: keyof Omit<Quiz, '_id' | 'questions'>,
    value: string
  ) => {
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz._id === quizId ? { ...quiz, [field]: value } : quiz
      )
    );
  };

  const handleQuestionChange = (
    quizId: string,
    questionId: string,
    field: keyof Omit<Question, '_id'>,
    value: string | string[]
  ) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz._id !== quizId) return quiz;
        const updated = quiz.questions.map((q) =>
          q._id === questionId ? { ...q, [field]: value } : q
        );
        return { ...quiz, questions: updated };
      })
    );
  };

  const handleOptionChange = (
    quizId: string,
    questionId: string,
    idx: number,
    value: string
  ) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz._id !== quizId) return quiz;
        const updatedQs = quiz.questions.map((q) => {
          if (q._id !== questionId) return q;
          const newOpts = [...q.options];
          newOpts[idx] = value;
          let newCorrect = q.correctAnswer;
          if (newCorrect === q.options[idx]) newCorrect = value;
          return { ...q, options: newOpts, correctAnswer: newCorrect };
        });
        return { ...quiz, questions: updatedQs };
      })
    );
  };

  const handleAddQuestion = async (quizId: string) => {
    const res = await api.post(`/modules/quiz/${quizId}`, {
      question: "Enter your question here",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: "Option 1",
    });
    const newQ = res.data as Question;
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz._id === quizId
          ? { ...quiz, questions: [...quiz.questions, newQ] }
          : quiz
      )
    );
  };

  const handleRemoveQuestion = async (quizId: string, questionId: string) => {
    await api.delete(`/modules/quiz/${quizId}/question/${questionId}`);
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz._id === quizId
          ? { ...quiz, questions: quiz.questions.filter((q) => q._id !== questionId) }
          : quiz
      )
    );
  };

  // --- Save module (combines updating module & nested resources) ---
  const handleSaveModule = async (e: FormEvent) => {
    e.preventDefault();
    // update module metadata
    await api.put(`/modules/${module.id}`, {
      title: moduleTitle,
      subsectionIds: order,
      quizIds: moduleQuizIds,
    });
    // update subsections bodies & titles
    await Promise.all(
      subsections.map((sub) =>
        api.put(`/modules/subsection/${sub._id}`, {
          title: sub.title,
          layout: sub.layout,
        })
      )
    );
    // update quizzes & questions
    await Promise.all(
      quizzes.map(async (quiz) => {
        await api.put(`/modules/quiz/${quiz._id}`, {
          title: quiz.title,
          description: quiz.description,
        });
        if (quiz.questions.length) {
          await Promise.all(
            quiz.questions.map((q) =>
              api.put(`/modules/question/${q._id}`, {
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
              })
            )
          );
        }
      })
    );
    onModuleUpdated();
    setEditModule(null);
  };

  return (
    <form onSubmit={handleSaveModule} className="p-6 w-full max-w-6xl mx-auto">
      {/* Module Title */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-600 mb-1">
          Module Title
        </label>
        <input
          className="text-2xl font-bold mb-4 w-full border-b focus:outline-none"
          value={moduleTitle}
          onChange={(e) => setModuleTitle(e.target.value)}
          placeholder="Enter module title"
          required
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {['subsections','quizzes'].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 cursor-pointer ${
              activeTab===tab ? 'font-semibold border-b-2 border-blue-600' : 'text-gray-600'
            }`}
          >{tab==='subsections'?'Subsections':'Quizzes'}</div>
        ))}
      </div>

      {/* Subsections Tab */}
      {activeTab==='subsections' && (
        <div className="mb-6">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={subsections.map(s=>s._id)} strategy={verticalListSortingStrategy}>
              {subsections.map(sub=> (
                <SubItem key={sub._id}
                  sub={{id:sub._id,title:sub.title}}
                  isEditing={editingTitleId===sub._id}
                  editingValue={editingTitleValue}
                  onStartEdit={()=>{setEditingTitleId(sub._id);setEditingTitleValue(sub.title)}}
                  onChangeEdit={setEditingTitleValue}
                  onSaveEdit={()=>saveSubsectionTitle(sub._id)}
                  onEditContent={()=>setEditingSubId(sub._id)}
                  selected={selectedSubId===sub._id}
                  onToggleSelect={()=>setSelectedSubId(prev=>prev===sub._id?null:sub._id)}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={handleAddSubsection} className="bg-green-500 text-white px-4 py-2 rounded">
              + Add Subsection
            </button>
            {editingTitleId===null && (
              <button type="button" disabled={!selectedSubId}
                onClick={()=>selectedSubId && setDeleteConfirmSub(selectedSubId)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >Delete Selected</button>
            )}
          </div>
        </div>
      )}

      {/* Quizzes Tab (file2 UI) */}
      {activeTab==='quizzes' && (
        <div className="mb-6">
          {quizzes.map(quiz=> (
            <div key={quiz._id} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={quiz.title}
                  onChange={e=>handleQuizChange(quiz._id,'title',e.target.value)}
                  className="w-full p-2 border rounded mr-4"
                  placeholder="Quiz Title"
                  required
                />
                <button type="button" onClick={()=>setDeleteConfirmQuiz(quiz._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >Delete</button>
              </div>
              <textarea
                value={quiz.description}
                onChange={e=>handleQuizChange(quiz._id,'description',e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Quiz Description"
              />
              {quiz.questions.map(question=> (
                <div key={question._id} className="mb-4 p-3 border rounded bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      value={question.question}
                      onChange={e=>handleQuestionChange(quiz._id,question._id,'question',e.target.value)}
                      className="w-full p-2 border rounded mr-2"
                      placeholder="Question"
                    />
                    <button type="button" onClick={()=>handleRemoveQuestion(quiz._id,question._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >Remove</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((opt,idx)=>(
                      <input key={idx} type="text" value={opt}
                        onChange={e=>handleOptionChange(quiz._id,question._id,idx,e.target.value)}
                        className="p-2 border rounded" placeholder={`Option ${idx+1}`}
                      />
                    ))}
                  </div>
                  <select
                    value={question.correctAnswer}
                    onChange={e=>handleQuestionChange(quiz._id,question._id,'correctAnswer',e.target.value)}
                    className="mt-2 p-2 border rounded w-full"
                  >
                    {question.options.map((_,i)=>(
                      <option key={i} value={question.options[i]}>Option {i+1}</option>
                    ))}
                  </select>
                </div>
              ))}
              <button type="button" onClick={()=>handleAddQuestion(quiz._id)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >Add Question</button>
            </div>
          ))}
          <button type="button" onClick={handleAddQuiz}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >Add Quiz</button>
        </div>
      )}

      {/* BlockEditorModal for subsections */}
      {editingSubId && (
        <BlockEditorModal
          subsectionId={editingSubId}
          initialTitle={subsections.find((s) => s._id === editingSubId)!.title}
          initialLayout={subsections.find((s) => s._id === editingSubId)!.layout}
          onTitleChange={(newT) =>
            setSubsections((s) =>
              s.map((x) => (x._id === editingSubId ? { ...x, title: newT } : x))
            )
          }
          onLayoutChange={(newLayout) =>
            setSubsections((s) =>
              s.map((x) =>
                x._id === editingSubId ? { ...x, layout: newLayout } : x
              )
            )
          }
          onClose={() => setEditingSubId(null)}
        />
      )}

      {/* Delete confirmations */}
      {deleteConfirmSub && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow">
            <p>Delete this subsection?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => handleDeleteSubsection(deleteConfirmSub)} className="bg-red-600 text-white px-4 py-2 rounded">Yes</button>
              <button onClick={() => setDeleteConfirmSub(null)} className="px-4 py-2 rounded border">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {deleteConfirmQuiz && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow">
            <p>Delete this quiz and its questions?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => handleDeleteQuiz(deleteConfirmQuiz)} className="bg-red-600 text-white px-4 py-2 rounded">Yes</button>
              <button onClick={() => setDeleteConfirmQuiz(null)} className="px-4 py-2 rounded border">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Save & Cancel Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={() => setEditModule(null)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Module</button>
      </div>
    </form>
  );
}
