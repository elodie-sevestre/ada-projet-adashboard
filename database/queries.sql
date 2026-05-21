SELECT 
      projects.id, 
      projects.name, 
      projects.description, 
      projects.status, 
      TO_CHAR(started_at, 'DD-MM-YYYY') AS started_at, 
      TO_CHAR(finished_at, 'DD-MM-YYYY') AS finished_at, 
      TO_CHAR(projects.created_at, 'DD-MM-YYYY') AS created_at,
      COUNT(skills.id) AS total_skills,
      COUNT(skills.id) FILTER (WHERE skills.validated = true) AS validated_skills
    FROM projects 
    LEFT JOIN skills ON projects.id = skills.project_id 
    GROUP BY projects.id 
    ORDER BY projects.id;