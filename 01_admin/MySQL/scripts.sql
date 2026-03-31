mariadb -u root -p -e " use moodle; 

SELECT 
c.shortname, 
from_unixtime(st.starttime) AS data, 
u.username, 
concat(u.firstname, ' ',  u.lastname) AS nome,
st.duration, 
st.exclusivity  
FROM mdl_course AS c 
JOIN mdl_scheduler AS s ON (s.course = c.id) 
JOIN mdl_scheduler_slots AS st ON (s.id = st.schedulerid) 
JOIN mdl_scheduler_appointment AS a ON (st.id = a.slotid) 
JOIN mdl_user AS u ON (a.studentid = u.id) 
ORDER BY 
c.shortname, st.starttime, nome, u.username;" 

> /var/lib/mysql/files/resultado.txt