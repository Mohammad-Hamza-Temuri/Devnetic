import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SKILL_OPTIONS = [
  "React", "Node.js", "Express", "MongoDB", "JavaScript",
  "TypeScript", "Tailwind CSS", "Next.js", "Python", "SQL",
];

const SkillMultiSelect = ({ selectedSkills, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown if the user clicks anywhere outside it
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleSkill(skill) {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter((s) => s !== skill));
    } else {
      onChange([...selectedSkills, skill]);
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white rounded-xl border border-gray-300 py-2 px-3 text-sm text-gray-700 cursor-pointer"
      >
        <span className="truncate">
          {selectedSkills.length > 0
            ? `${selectedSkills.length} skill${selectedSkills.length > 1 ? "s" : ""} selected`
            : "Select skills..."}
        </span>
        <ChevronDown size={16} className="shrink-0 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-gray-200 shadow-lg max-h-56 overflow-y-auto">
          {SKILL_OPTIONS.map((skill) => (
            <label
              key={skill}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill)}
                onChange={() => toggleSkill(skill)}
                className="accent-primary"
              />
              {skill}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillMultiSelect;