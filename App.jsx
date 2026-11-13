import { useMemo, useState } from "react";
import "./App.css";

// SAMPLE RESOURCE DATA
const resources = [
  {
    id: "1",
    topic: "AI Fundamentals",
    title: "Introduction to Generative AI",
    description: "Introduce core concepts, explore classroom examples, and discuss what generative AI can and cannot do.",
    author: "Dr. Elena Rivera",
    difficulty: "Beginner",
    type: "Document",
    format: "Lesson plan · Document",
    duration: 20,
    rating: 4.8,
    reviews: 24,
    uses: 1248,
    updated: "2026-11-12",
  },
  {
    id: "2",
    topic: "Responsible AI",
    title: "AI Ethics in Education",
    description: "Guide a structured discussion on privacy, academic integrity, and responsible AI use in teaching.",
    author: "Dr. Maya Chen",
    difficulty: "Intermediate",
    type: "Document",
    format: "Discussion guide · Document",
    duration: 45,
    rating: 4.9,
    reviews: 18,
    uses: 862,
    updated: "2026-11-10",
  },
  {
    id: "3",
    topic: "Prompt Engineering",
    title: "Prompt Engineering for Educators",
    description: "Build better prompts with practical templates for lesson planning, feedback, and classroom activities.",
    author: "Prof. Daniel Okafor",
    difficulty: "Beginner",
    type: "Slides",
    format: "Workshop slides · PPTX",
    duration: 30,
    rating: 4.7,
    reviews: 32,
    uses: 1086,
    updated: "2026-11-08",
  },
  {
    id: "4",
    topic: "Responsible AI",
    title: "Understanding AI Bias",
    description: "Use real-world scenarios to identify biased outputs and evaluate their impact on learners.",
    author: "Dr. Priya Nair",
    difficulty: "Intermediate",
    type: "Article",
    format: "Activity pack · Article",
    duration: 60,
    rating: 4.8,
    reviews: 21,
    uses: 734,
    updated: "2026-10-22",
  },
  {
    id: "5",
    topic: "AI Fundamentals",
    title: "Machine Learning Explained",
    description: "Explore how machine learning works through accessible examples and classroom activities.",
    author: "Dr. Elena Rivera",
    difficulty: "Beginner",
    type: "Video",
    format: "Video lesson · MP4",
    duration: 12,
    rating: 4.6,
    reviews: 15,
    uses: 621,
    updated: "2026-11-11",
  },
  {
    id: "6",
    topic: "Prompt Engineering",
    title: "Creating Better AI Prompts",
    description: "Learn techniques for writing clear prompts and evaluating AI-generated responses.",
    author: "Prof. Daniel Okafor",
    difficulty: "Advanced",
    type: "Slides",
    format: "Workshop slides · PPTX",
    duration: 25,
    rating: 4.7,
    reviews: 12,
    uses: 512,
    updated: "2026-10-15",
  },
  {
    id: "7",
    topic: "Responsible AI",
    title: "AI and Student Privacy",
    description: "Understand privacy considerations when introducing AI tools into learning environments.",
    author: "Dr. Maya Chen",
    difficulty: "Intermediate",
    type: "Document",
    format: "Teaching guide · Document",
    duration: 35,
    rating: 4.9,
    reviews: 27,
    uses: 905,
    updated: "2026-09-10",
  },
  {
    id: "8",
    topic: "AI Fundamentals",
    title: "AI Literacy for Beginners",
    description: "An introductory resource covering AI concepts, applications, and limitations.",
    author: "Dr. Priya Nair",
    difficulty: "Beginner",
    type: "Article",
    format: "Reading material · Article",
    duration: 10,
    rating: 4.5,
    reviews: 11,
    uses: 430,
    updated: "2026-09-28",
  },
];

// LEARNING MODULES
const modules = [
  {
    name: "All Resources",
    description: "Browse the full repository across all modules.",
    icon: "▦",
  },
  {
    name: "AI Basics",
    description: "Core concepts, definitions, and classroom examples.",
    icon: "⚙",
  },
  {
    name: "Understanding AI",
    description: "Explain capabilities, limitations, and real-world impact.",
    icon: "◈",
  },
  {
    name: "Prompting with purpose",
    description: "Craft clear prompts for lesson planning and feedback.",
    icon: ">_",
  },
  {
    name: "Responsible AI",
    description: "Ethics, bias, and responsible classroom use.",
    icon: "⬡",
  },
];

// REUSABLE STATISTICS CARD
function StatsCard({ title, value, subtitle, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-heading">
        <span>{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>

      <div className="stat-value">{value}</div>
      <p>{subtitle}</p>
    </div>
  );
}

// REUSABLE CATEGORY TAG
function CategoryTag({ children }) {
  return <span className="category-tag">{children}</span>;
}

// REUSABLE RESOURCE CARD
function ResourceCard({ resource, saved, onToggleSave }) {
  return (
    <article className="resource-card">
      <div className="card-top">
        <CategoryTag>{resource.topic}</CategoryTag>

        <button
          type="button"
          className={`bookmark-button ${saved ? "saved" : ""}`}
          onClick={() => onToggleSave(resource.id)}
          aria-label="Toggle bookmark"
        >
          {saved ? "★" : "☆"}
        </button>
      </div>

      <h3>{resource.title}</h3>

      <p className="resource-description">
        {resource.description}
      </p>

      <p className="author">By {resource.author}</p>

      <div className="resource-tags">
        <span className="difficulty">
          {resource.difficulty}
        </span>

        <span>{resource.format}</span>

        <span className="difficulty">
          Potential duration: {resource.duration} min
        </span>
      </div>

      <div className="resource-metrics">
        <span>
          ★ {resource.rating} ({resource.reviews} reviews)
        </span>

        <span>{resource.uses.toLocaleString()} uses</span>
      </div>

      <div className="card-bottom">
        <span>
          Updated{" "}
          {new Date(
            resource.updated + "T12:00:00"
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        <a
          href={`/resources/${resource.id}`}
          className="details-button"
        >
          View Details
        </a>
      </div>
    </article>
  );
}

// MAIN APPLICATION
function App() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [type, setType] = useState("All");
  const [updated, setUpdated] = useState("All");
  const [duration, setDuration] = useState("All");

  // DEFAULT SORTING: HIGHEST RATED FIRST
  const [sort, setSort] = useState("highest-rated");

  const [saved, setSaved] = useState(["2"]);
  const [page, setPage] = useState(1);

  const [selectedModule, setSelectedModule] =
    useState("All Resources");

  const topics = [...new Set(resources.map((r) => r.topic))];
  const types = [...new Set(resources.map((r) => r.type))];

  // SELECT LEARNING MODULE
  function selectModule(module) {
    setSelectedModule(module);
    setTopic("All");
    setPage(1);
  }

  // UPDATE FILTERS
  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  // SEARCH, FILTER, AND SORT RESOURCES
  const filteredResources = useMemo(() => {
    let result = resources.filter((r) => {
      const query = search.toLowerCase().trim();

      const matchesSearch = [
        r.title,
        r.description,
        r.author,
        r.topic,
        r.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesModule =
        selectedModule === "All Resources" ||
        (selectedModule === "AI Basics" &&
          r.topic === "AI Fundamentals") ||
        (selectedModule === "Understanding AI" &&
          ["AI Fundamentals", "Responsible AI"].includes(r.topic)) ||
        (selectedModule === "Prompting with purpose" &&
          r.topic === "Prompt Engineering") ||
        (selectedModule === "Responsible AI" &&
          r.topic === "Responsible AI");

      const matchesTopic =
        topic === "All" || r.topic === topic;

      const matchesDifficulty =
        difficulty === "All" || r.difficulty === difficulty;

      const matchesType =
        type === "All" || r.type === type;

      const cutoff = Number(updated);

      const matchesDate =
        updated === "All" ||
        new Date(r.updated + "T12:00:00") >=
          new Date(Date.now() - cutoff * 86400000);

      const matchesDuration =
        duration === "All" ||
        (duration === "under15" && r.duration < 15) ||
        (duration === "15to30" &&
          r.duration >= 15 && r.duration <= 30) ||
        (duration === "31to60" &&
          r.duration > 30 && r.duration <= 60) ||
        (duration === "over60" && r.duration > 60);

      return (
        matchesSearch &&
        matchesModule &&
        matchesTopic &&
        matchesDifficulty &&
        matchesType &&
        matchesDate &&
        matchesDuration
      );
    });

    // HIGHEST RATED FIRST
    if (sort === "highest-rated") {
      result.sort(
        (a, b) =>
          (b.rating - a.rating) ||
          (b.reviews - a.reviews)
      );
    }

    // LOWEST RATED FIRST
    if (sort === "lowest-rated") {
      result.sort(
        (a, b) =>
          (a.rating - b.rating) ||
          (b.reviews - a.reviews)
      );
    }

    // MOST REVIEWS FIRST
    if (sort === "most-reviewed") {
      result.sort((a, b) => b.reviews - a.reviews);
    }

    // FEWEST REVIEWS FIRST
    if (sort === "least-reviewed") {
      result.sort((a, b) => a.reviews - b.reviews);
    }

    // MOST RECENTLY UPDATED FIRST
    if (sort === "newest") {
      result.sort((a, b) =>
        b.updated.localeCompare(a.updated)
      );
    }

    // MOST POPULAR FIRST
    if (sort === "popular") {
      result.sort((a, b) => b.uses - a.uses);
    }

    return result;
  }, [
    search,
    topic,
    difficulty,
    type,
    updated,
    duration,
    sort,
    selectedModule,
  ]);

  // PAGINATION
  const perPage = 4;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredResources.length / perPage)
  );

  const visibleResources = filteredResources.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const first = filteredResources.length
    ? (page - 1) * perPage + 1
    : 0;

  const last = Math.min(
    page * perPage,
    filteredResources.length
  );

  // BOOKMARKS
  function toggleSave(id) {
    setSaved((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  // CLEAR FILTERS
  function clearFilters() {
    setSearch("");
    setTopic("All");
    setDifficulty("All");
    setType("All");
    setUpdated("All");
    setDuration("All");

    // RESET TO HIGHEST RATED
    setSort("highest-rated");

    setSelectedModule("All Resources");
    setPage(1);
  }

  return (
    <div className="app-shell">

      {/* MAIN NAVIGATION SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">A</span>
          <span>ALIGN</span>
        </div>

        <nav className="sidebar-nav">
          <button type="button">
            ▦ <span>Dashboard</span>
          </button>

          <button type="button" className="active">
            ▣ <span>Materials Repository</span>
          </button>

          <button type="button">
            ☆ <span>Saved Resources</span>
          </button>

          <button type="button">
            ＋ <span>Contribute a Resource</span>
          </button>

          <button type="button">
            ▤ <span>My Contributions</span>
          </button>
        </nav>

        <div className="sidebar-profile">
          <div className="profile-avatar">MC</div>

          <div>
            <strong>Dr. Maya Chen</strong>
            <span>Faculty</span>
          </div>
        </div>

        <button type="button" className="settings-button">
          ⚙ <span>Settings</span>
        </button>
      </aside>

      {/* LEARNING MODULES SIDEBAR */}
      <aside className="modules-sidebar">
        <div className="modules-heading">
          <h3>Learning modules</h3>

          <p>
            Browse resources by module and teaching focus.
          </p>
        </div>

        <div className="module-list">
          {modules.map((module) => (
            <button
              type="button"
              key={module.name}
              className={`module-card ${
                selectedModule === module.name ? "selected" : ""
              }`}
              onClick={() => selectModule(module.name)}
            >
              <span className="module-icon">
                {module.icon}
              </span>

              <span className="module-text">
                <strong>{module.name}</strong>
                <small>{module.description}</small>
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* MATERIALS REPOSITORY MAIN PAGE */}
      <main className="main-content">
        <div className="topbar">
          <span>Faculty workspace</span>

          <span className="workspace-tag">
            AI LITERACY
          </span>

          <div className="university">
            ♧ &nbsp; University of North Carolina Charlotte
          </div>
        </div>

        {/* WELCOME */}
        <section className="welcome-section">
          <div>
            <h1>Materials Repository</h1>

            <p>
              Browse, save, and share AI literacy teaching resources
              aligned to the approved course modules.
            </p>
          </div>

          <button
            type="button"
            className="contribute-button"
            onClick={() => alert("Contribution form coming soon!")}
          >
            Contribute a Resource + →
          </button>
        </section>

        {/* STATISTICS */}
        <section className="stats-grid">
          <StatsCard
            title="Total Resources"
            value="128"
            subtitle="Across 8 teaching topics"
            icon="▥"
          />

          <StatsCard
            title="Saved Resources"
            value={12 + saved.length - 1}
            subtitle="Your personal teaching collection"
            icon="☆"
          />

          <StatsCard
            title="My Contributions"
            value="6"
            subtitle="3 approved resources"
            icon="▤"
          />

          <StatsCard
            title="Pending Reviews"
            value="1"
            subtitle="Awaiting a reviewer"
            icon="◷"
          />
        </section>

        {/* SEARCH AND FILTERS */}
        <section className="filter-panel">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="search"
              placeholder="Search AI literacy resources..."
              value={search}
              onChange={(e) =>
                updateFilter(setSearch, e.target.value)
              }
            />
          </div>

          <div className="filter-grid">
            {/* TOPIC FILTER */}
            <select
              value={topic}
              onChange={(e) =>
                updateFilter(setTopic, e.target.value)
              }
            >
              <option value="All">Topic</option>

              {topics.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* DIFFICULTY FILTER */}
            <select
              value={difficulty}
              onChange={(e) =>
                updateFilter(setDifficulty, e.target.value)
              }
            >
              <option value="All">Difficulty Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* RESOURCE TYPE FILTER */}
            <select
              value={type}
              onChange={(e) =>
                updateFilter(setType, e.target.value)
              }
            >
              <option value="All">Resource Type</option>

              {types.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* LAST UPDATED FILTER */}
            <select
              value={updated}
              onChange={(e) =>
                updateFilter(setUpdated, e.target.value)
              }
            >
              <option value="All">Last Updated</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>

          {/* ADDITIONAL FILTERS */}
          <div className="extra-filters">

            {/* POTENTIAL DURATION FILTER */}
            <select
              value={duration}
              onChange={(e) =>
                updateFilter(setDuration, e.target.value)
              }
              aria-label="Filter by potential duration"
            >
              <option value="All">Potential Duration</option>
              <option value="under15">Under 15 minutes</option>
              <option value="15to30">15–30 minutes</option>
              <option value="31to60">31–60 minutes</option>
              <option value="over60">Over 60 minutes</option>
            </select>

            {/* RESOURCE SORTING */}
            <select
              value={sort}
              onChange={(e) =>
                updateFilter(setSort, e.target.value)
              }
              aria-label="Sort resources"
            >
              <option value="highest-rated">
                Sort: Highest Rated
              </option>

              <option value="lowest-rated">
                Lowest Rated
              </option>

              <option value="most-reviewed">
                Most Reviews
              </option>

              <option value="least-reviewed">
                Fewest Reviews
              </option>

              <option value="newest">
                Recently Updated
              </option>

              <option value="popular">
                Most Popular
              </option>
            </select>

            <button
              type="button"
              className="clear-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </section>

        {/* RESOURCE SECTION */}
        <section className="resources-section">
          <div className="section-heading">
            <h2>Teaching Resources</h2>

            <div className="result-controls">
              Showing {first}–{last} of {filteredResources.length}
            </div>
          </div>

          <div className="resource-tabs">
            <button
              type="button"
              className="tab-active"
              onClick={clearFilters}
            >
              All Resources
            </button>

            <button
              type="button"
              onClick={() =>
                alert("Saved Resources view can be integrated later.")
              }
            >
              Saved Resources
            </button>
          </div>

          {/* SORTED RESOURCE CARDS */}
          <div className="resource-grid">
            {visibleResources.length > 0 ? (
              visibleResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  saved={saved.includes(resource.id)}
                  onToggleSave={toggleSave}
                />
              ))
            ) : (
              <div className="empty-state">
                <h3>No resources found</h3>

                <p>
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* PAGINATION */}
        <footer className="pagination">
          <span>
            {filteredResources.length} sample resources
          </span>

          <div className="pagination-buttons">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((number) => (
              <button
                type="button"
                key={number}
                className={page === number ? "current-page" : ""}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;