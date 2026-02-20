bot UniversityAdmissionsBot
domain education
tone professional

welcome "Welcome to State University Admissions! How can I help you today?"

intent admission_requirements
keywords: requirements eligibility criteria admission :
response "To apply, you need:
✅ High school diploma/GED
✅ Minimum GPA of 3.0
✅ SAT score of 1200 or ACT of 25
✅ Letter of recommendation
✅ Personal essay"

intent application_deadline
keywords: deadline due date apply when :
response "Important deadlines:
🎓 Early Action: November 1
🎓 Regular Decision: January 15
🎓 Financial Aid: March 1
🎓 Housing Application: May 1"

intent tuition_fees
keywords: tuition fees cost price expensive :
response "Tuition for 2024-2025:
📚 In-state: $12,500 per year
📚 Out-of-state: $28,000 per year
📚 Room & Board: $10,000 per year
📚 Books & Supplies: $1,200 per year"

intent scholarships
keywords: scholarship financial aid grant money :
response "We offer several scholarships:
🏆 Merit-based: Up to $10,000 (3.5+ GPA)
🏆 Athletic scholarships
🏆 Need-based grants
🏆 Departmental awards
Apply by January 15 for priority consideration!"

intent campus_tour
keywords: tour visit campus schedule :
response "Campus tours are available:
🗓️ Monday-Friday: 10 AM and 2 PM
🗓️ Saturdays: 11 AM
Book your tour at: university.edu/visit"

lead_capture name email phone graduation_year

fallback "I couldn't find specific information about that. Please email admissions@university.edu or call 555-0123 for assistance."