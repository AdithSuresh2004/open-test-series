import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Home,
  Book,
  Target,
  AlertCircle,
  Search,
} from "lucide-react";
import { getExamsManifest } from "../services/examsService";
import TestCard from "../components/ui/TestCard";
import { HiSearch } from "react-icons/hi";

const TEST_TYPES = [
  { id: "all", label: "All Tests", icon: Home },
  { id: "full_tests", label: "Mock Tests", icon: FileText },
  { id: "subject_tests", label: "Subject Wise", icon: Book },
  { id: "topic_tests", label: "Topic Wise", icon: Target },
];

const STRENGTHS = ["All levels", "easy", "medium", "hard"];

export default function ExamSelectionPage() {
  const [manifest, setManifest] = useState({
    full_tests: [],
    subject_tests: [],
    topic_tests: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState("All Exams");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedStrength, setSelectedStrength] = useState("All levels");

  useEffect(() => {
    loadManifest();
  }, []);

  const loadManifest = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExamsManifest();
      setManifest(data);
    } catch (err) {
      setError(err.message || "Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  // Combine all tests
  const allTests = useMemo(
    () => [
      ...(manifest.full_tests || []).map((t) => ({ ...t, type: "full_tests" })),
      ...(manifest.subject_tests || []).map((t) => ({
        ...t,
        type: "subject_tests",
      })),
      ...(manifest.topic_tests || []).map((t) => ({
        ...t,
        type: "topic_tests",
      })),
    ],
    [manifest]
  );

  // Exam names, topics, subjects for dropdowns
  const examNames = useMemo(
    () => ["All Exams", ...new Set(allTests.map((t) => t.category).filter(Boolean))],
    [allTests]
  );
  
  const topics = useMemo(() => {
    const topicSet = new Set();
    allTests.forEach((t) => {
      if (t.topics?.length) {
        t.topics.forEach((topic) => topicSet.add(topic));
      } else if (t.topic) {
        topicSet.add(t.topic);
      }
    });
    return ["All Topics", ...Array.from(topicSet).filter(Boolean)];
  }, [allTests]);
  
  const subjects = useMemo(() => {
    const subjectSet = new Set();
    allTests.forEach((t) => {
      if (t.subjects?.length) {
        t.subjects.forEach((subject) => subjectSet.add(subject));
      } else if (t.subject) {
        subjectSet.add(t.subject);
      }
    });
    return ["All Subjects", ...Array.from(subjectSet).filter(Boolean)];
  }, [allTests]);

  // Tab counts
  const tabCounts = useMemo(
    () =>
      TEST_TYPES.map((type) => {
        const count =
          type.id === "all"
            ? allTests.length
            : allTests.filter((t) => t.type === type.id).length;
        return { ...type, count };
      }),
    [allTests]
  );

  // Filtered tests
  const filteredTests = useMemo(() => {
    return allTests
      .filter((t) => activeTab === "all" || t.type === activeTab)
      .filter((t) => selectedExam === "All Exams" || t.category === selectedExam)
      .filter(
        (t) =>
          selectedTopic === "All Topics" ||
          (t.topic && t.topic === selectedTopic) ||
          (t.topics?.includes(selectedTopic))
      )
      .filter(
        (t) =>
          selectedSubject === "All Subjects" ||
          (t.subject && t.subject === selectedSubject) ||
          (t.subjects?.includes(selectedSubject))
      )
      .filter(
        (t) =>
          selectedStrength === "All levels" || 
          t.exam_strength === selectedStrength
      )
      .filter((t) => {
        if (!searchTerm.trim()) return true;
        
        const search = searchTerm.toLowerCase().trim();
        const searchableFields = [
          t.exam_name,
          t.subject,
          t.topic,
          t.category,
          ...(t.subjects || []),
          ...(t.topics || [])
        ].filter(Boolean);

        console.log(searchableFields)
        
        return searchableFields.some(field => 
          field.toLowerCase().includes(search)
        );
      })
      .sort((a, b) => (a.exam_name || "").localeCompare(b.exam_name || ""));
  }, [
    allTests,
    activeTab,
    selectedExam,
    selectedTopic,
    selectedSubject,
    selectedStrength,
    searchTerm,
  ]);
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "examName":
        setSelectedExam(value);
        break;
      case "topic":
        setSelectedTopic(value);
        break;
      case "subject":
        setSelectedSubject(value);
        break;
      case "strength":
        setSelectedStrength(value);
        break;
      default:
        break;
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading exams...</p>
        </div>
      </div>
    );
    
  if (error)
    return (
      <div className="flex items-center justify-center min-h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Exams
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadManifest}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
    
  if (!allTests.length)
    return (
      <div className="flex items-center justify-center min-h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
            No Exams Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please check back later for available exams.
          </p>
        </div>
      </div>
    );

  return (
    <div className="mx-auto min-h-full px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Available Exams
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Select an exam to begin your practice session
        </p>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex">
            {tabCounts.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`flex-1 flex items-center justify-center py-3 px-2 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === type.id
                      ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="hidden sm:inline truncate mr-1">
                    {type.label}
                  </span>
                  <span className="sm:hidden text-xs truncate mr-1">
                    {type.label.split(' ')[0]}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full flex-shrink-0">
                    {type.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                placeholder="Search exams..."
                className="w-full pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Exam Name */}
            <select
              className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-colors"
              name="examName"
              value={selectedExam}
              onChange={handleChange}
            >
              {examNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            {/* Topic */}
            <select
              className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-colors"
              name="topic"
              value={selectedTopic}
              onChange={handleChange}
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>

            {/* Subject */}
            <select
              className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-colors"
              name="subject"
              value={selectedSubject}
              onChange={handleChange}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            {/* Strength */}
            <select
              className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-colors"
              name="strength"
              value={selectedStrength}
              onChange={handleChange}
            >
              {STRENGTHS.map((strength) => (
                <option key={strength} value={strength}>
                  {strength === "All levels" ? "All Levels" : strength.charAt(0).toUpperCase() + strength.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Test Grid */}
        {filteredTests.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              No tests found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedExam("All Exams");
                setSelectedTopic("All Topics");
                setSelectedSubject("All Subjects");
                setSelectedStrength("All levels");
                setActiveTab("all");
              }}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTests.map((test) => (
              <TestCard key={test.exam_id || `${test.type}-${test.exam_name}`} test={test} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}