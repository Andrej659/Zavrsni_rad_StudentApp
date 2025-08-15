import React, { useEffect, useState, useMemo } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import type { Event as RBCEvent } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { hr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  hr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface Course {
  courseID: number;
  courseName: string;
  academicYear: { acYrID: number; acYrName: string };
}
interface Event {
  eventID: number;
  eventName: string;
  eventDate: string;
  course: { courseID: number; courseName: string };
}
interface isAttending {
  attendingID: number;
  course: { courseID: number; courseName: string };
  user: { userID: number; username: string };
}

const CalendarContent: React.FC = () => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [subscribedCourses, setSubscribedCourses] = useState<number[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const sortedCourses = useMemo(() => {
    const subscribed = allCourses.filter((c) =>
      subscribedCourses.includes(c.courseID)
    );
    const unsubscribed = allCourses.filter(
      (c) => !subscribedCourses.includes(c.courseID)
    );
    return [...subscribed, ...unsubscribed];
  }, [allCourses, subscribedCourses]);

  const facultyID = useMemo(() => {
    try {
      const facultyId = localStorage.getItem("facultyId");
      if (!facultyId) return null;
      return facultyId;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!facultyID) {
      setAllCourses([]);
      return;
    }
    const loadCoursesForFaculty = async () => {
      try {
        const token = localStorage.getItem("token");
        const yearsRes = await fetch(
          `http://localhost:8080/api/academic-years/faculty/${facultyID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!yearsRes.ok) throw new Error("Failed to fetch academic years");
        const yearsData = await yearsRes.json();

        let allCourses: Course[] = [];
        for (const year of yearsData) {
          const coursesRes = await fetch(
            `http://localhost:8080/api/courses/academic-year/${year.acYrID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!coursesRes.ok)
            throw new Error(
              "Failed to fetch courses for academic year " + year.acYrID
            );
          const coursesData = await coursesRes.json();
          allCourses = allCourses.concat(coursesData);
        }
        setAllCourses(allCourses);
      } catch (error) {
        setAllCourses([]);
        console.error("Error loading courses for faculty:", error);
      }
    };
    loadCoursesForFaculty();
  }, [facultyID]);

  useEffect(() => {
    const fetchAttending = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/is-attending/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch attending");
        const data = await res.json();
        setSubscribedCourses(
          data
            .map((a: isAttending) => a.course.courseID)
            .filter((id: number) => id !== undefined && id !== null)
        );
      } catch (error) {
        setSubscribedCourses([]);
        console.error("Error fetching attending:", error);
      }
    };
    fetchAttending();
  }, []);

  useEffect(() => {
    if (subscribedCourses.length === 0) {
      setEvents([]);
      return;
    }
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:8080/api/events?courseIDs=${subscribedCourses.join(
            ","
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        setEvents([]);
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [subscribedCourses]);

  function parseJwt(token: string) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }

  const handleCheckboxChange = async (courseID: number, checked: boolean) => {
    const token = localStorage.getItem("token");
    const userID = token ? parseJwt(token)?.userID : null;
    const isAttending = {
      user: { userID: userID },
      course: { courseID: courseID },
    };

    if (checked) {
      await fetch(`http://localhost:8080/api/is-attending`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(isAttending),
      });
      setSubscribedCourses((subs) => [...subs, courseID]);
    } else {
      await fetch(
        `http://localhost:8080/api/is-attending/${courseID}/${userID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubscribedCourses((subs) => {
        const updated = subs.filter(
          (id) => id !== courseID && id !== undefined && id !== null
        );
        return updated;
      });
    }
  };

  const colorPalette = [
    "#9ad0ec",
    "#f9b5ac",
    "#b6e2a1",
    "#ffe066",
    "#bdb2ff",
    "#ffafcc",
    "#ffd6a5",
    "#cdb4db",
    "#a1cfff",
    "#caffbf",
    "#b5ead7",
    "#fdffb6",
    "#f8edeb",
    "#d0f4de",
    "#f6c6ea",
    "#e2f0cb",
    "#f3d1f4",
    "#c1cfff",
    "#fdc5f5",
    "#c2dfe3",
    "#d3f8e2",
    "#f9f9c5",
    "#aec6cf",
    "#d6d1b1",
    "#f4b393",
    "#b4d8e7",
    "#c2b9b0",
    "#f1c0e8",
    "#ffe5d9",
    "#d4a5a5",
  ];

  const courseColorMap: { [courseID: number]: string } = {};
  allCourses.forEach((course, idx) => {
    courseColorMap[course.courseID] = colorPalette[idx % colorPalette.length];
  });

  const calendarEvents: RBCEvent[] = useMemo(
    () =>
      events
        .filter((e) => subscribedCourses.includes(e.course.courseID))
        .map((e) => ({
          id: e.eventID,
          title: e.eventName,
          start: new Date(e.eventDate),
          end: new Date(e.eventDate),
          resource: { courseID: e.course.courseID },
          color: courseColorMap[e.course.courseID],
        })),
    [events, subscribedCourses, allCourses]
  );

  return (
    <div
      style={{
        display: "flex",
        gap: 40,
        height: "calc(100vh - 110px)",
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          flex: 3,
          minWidth: 400,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px #0001",
            padding: 8,
            minHeight: 0,
          }}
          popup
          views={["month", "week", "day"]}
          eventPropGetter={(event) => {
            // @ts-ignore
            const color = event.color || "#1976d2";
            return {
              style: {
                background: color,
                color: "#111",
                borderRadius: 12,
              },
            };
          }}
          messages={{
            today: "Danas",
            previous: "«",
            next: "»",
            month: "Mjesec",
            week: "Tjedan",
            day: "Dan",
            agenda: "Agenda",
            showMore: (total) => `+ još ${total}`,
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          background: "#f5f7fa",
          borderRadius: 10,
          padding: 24,
          minWidth: 250,
          height: "100%",
          boxShadow: "0 1px 4px #0001",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <h3 style={{ marginBottom: 18 }}>Moji predmeti</h3>
        {sortedCourses.map((course) => (
          <label
            key={course.courseID}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
              fontSize: 16,
            }}
          >
            <input
              type="checkbox"
              checked={subscribedCourses.includes(course.courseID)}
              onChange={(e) =>
                handleCheckboxChange(course.courseID, e.target.checked)
              }
              style={{ marginRight: 10 }}
            />
            {course.courseName}
            <span style={{ marginLeft: 8, fontSize: 12, color: "#888" }}>
              ({course.academicYear?.acYrName || "?"})
            </span>
          </label>
        ))}

        {allCourses.length === 0 && (
          <div style={{ color: "#999" }}>Nema predmeta.</div>
        )}
        <div style={{ flex: 1 }}></div>
      </div>
    </div>
  );
};

export default CalendarContent;
