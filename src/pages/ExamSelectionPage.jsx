import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Home,
  Book,
  Target,
  AlertCircle,
  Search,
  Filter,
  X,
  RotateCcw,
} from "lucide-react";
import { getExamsManifest } from "../services/examsService";
import TestCard from "../components/ui/TestCard";

const TEST_TYPES = [
  { id: "all", label: "All Tests", icon: Home },
  { id: "full_tests", label: "Mock Tests", icon: FileText },
  { id: "subject_tests", label: "Subject Wise", icon: Book },
  { id: "topic_tests", label: "Topic Wise", icon: Target },
];

const STRENGTHS = [
  { value: "All levels", label: "All Levels" },
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  // Combine all tests with better type handling
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

  // Extract unique values for filters with better handling
  const examNames = useMemo(
    () => [
      "All Exams",
      ...new Set(
        allTests
          .map((t) => t.category)
          .filter(Boolean)
          .sort()
      ),
    ],
    [allTests]
  );

  const topics = useMemo(() => {
    const topicSet = new Set();
    allTests.forEach((t) => {
      if (Array.isArray(t.topics)) {
        t.topics.forEach((topic) => topicSet.add(topic));
      }
      if (t.topic) topicSet.add(t.topic);
    });
    return ["All Topics", ...Array.from(topicSet).filter(Boolean).sort()];
  }, [allTests]);

  const subjects = useMemo(() => {
    const subjectSet = new Set();
    allTests.forEach((t) => {
      if (Array.isArray(t.subjects)) {
        t.subjects.forEach((subject) => subjectSet.add(subject));
      }
      if (t.subject) subjectSet.add(t.subject);
    });
    return ["All Subjects", ...Array.from(subjectSet).filter(Boolean).sort()];
  }, [allTests]);

  // Tab counts with better performance
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

  // Optimized filtering with better search
  const filteredTests = useMemo(() => {
    return allTests
      .filter((t) => activeTab === "all" || t.type === activeTab)
      .filter(
        (t) => selectedExam === "All Exams" || t.category === selectedExam
      )
      .filter(
        (t) =>
          selectedTopic === "All Topics" ||
          t.topic === selectedTopic ||
          (Array.isArray(t.topics) && t.topics.includes(selectedTopic))
      )
      .filter(
        (t) =>
          selectedSubject === "All Subjects" ||
          t.subject === selectedSubject ||
          (Array.isArray(t.subjects) && t.subjects.includes(selectedSubject))
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
          ...(Array.isArray(t.subjects) ? t.subjects : []),
          ...(Array.isArray(t.topics) ? t.topics : []),
        ]
          .filter(Boolean)
          .map((field) => field.toLowerCase());

        return searchableFields.some((field) => field.includes(search));
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

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm.trim() !== "" ||
      selectedExam !== "All Exams" ||
      selectedTopic !== "All Topics" ||
      selectedSubject !== "All Subjects" ||
      selectedStrength !== "All levels" ||
      activeTab !== "all"
    );
  }, [
    searchTerm,
    selectedExam,
    selectedTopic,
    selectedSubject,
    selectedStrength,
    activeTab,
  ]);

  const handleFilterChange = (name, value) => {
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

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedExam("All Exams");
    setSelectedTopic("All Topics");
    setSelectedSubject("All Subjects");
    setSelectedStrength("All levels");
    setActiveTab("all");
    setShowMobileFilters(false);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading exams...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <button
            onClick={loadManifest}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No Tests Available
  if (!allTests.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Exams Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're working hard to add more exams. Please check back later!
          </p>
          <button
            onClick={loadManifest}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 
        dark:border-gray-700 mb-6 w-full">
          <div className="border-b border-gray-200 dark:border-gray-700">
            {/* Use flex with `flex-1` to make tabs take up equal space and fit on a single line */}
            <div className="flex justify-between md:justify-start">
              {tabCounts.map((type) => {
                const Icon = type.icon;
                const isActive = activeTab === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setActiveTab(type.id)}
                    // flex-1 makes tabs expand to fill the available space equally
                    // min-w-0 combined with truncate ensures text doesn't overflow
                    className={`flex flex-1 items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-200 border-b-2 text-center min-w-0 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />

                    {/* Truncate the label text with ellipsis if it's too long */}
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          {/* Mobile Filter Toggle */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
            <button
              onClick={toggleMobileFilters}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="flex items-center text-gray-900 dark:text-gray-100 font-medium">
                <Filter className="w-5 h-5 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    Active
                  </span>
                )}
              </span>
              <X
                className={`w-5 h-5 transition-transform duration-200 ${
                  !showMobileFilters ? "rotate-45" : ""
                }`}
              />
            </button>
          </div>

          {/* Filter Content */}
          <div
            className={`${showMobileFilters ? "block" : "hidden"} lg:block p-4`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="relative sm:col-span-2 lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exams..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Exam Category */}
              <select
                className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-colors"
                value={selectedExam}
                onChange={(e) => handleFilterChange("examName", e.target.value)}
              >
                {examNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              {/* Subject */}
              <select
                className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-colors"
                value={selectedSubject}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>

              {/* Topic */}
              <select
                className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-colors"
                value={selectedTopic}
                onChange={(e) => handleFilterChange("topic", e.target.value)}
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>

              {/* Difficulty */}
              <select
                className="px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 transition-colors"
                value={selectedStrength}
                onChange={(e) => handleFilterChange("strength", e.target.value)}
              >
                {STRENGTHS.map((strength) => (
                  <option key={strength.value} value={strength.value}>
                    {strength.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredTests.length === 0 ? (
              "No tests found"
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {filteredTests.length}
                </span>
                {filteredTests.length !== allTests.length && (
                  <>
                    {" "}
                    of <span className="font-semibold">{allTests.length}</span>
                  </>
                )}{" "}
                tests
              </>
            )}
          </p>
        </div>

        {/* Test Grid */}
        {filteredTests.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No tests match your criteria
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your search terms or filters to find the perfect
              practice test for you.
            </p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <TestCard
                key={test.uid || test.exam_id || `${test.type}-${test.exam_name}`}
                test={test}
                selectedTopic={
                  selectedTopic !== "All Topics" ? selectedTopic : undefined
                }
                selectedSubject={
                  selectedSubject !== "All Subjects"
                    ? selectedSubject
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
