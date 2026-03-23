package com.tasktracker.tasktracker.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tasktracker.tasktracker.model.Priority;
import com.tasktracker.tasktracker.model.Status;
import com.tasktracker.tasktracker.model.Task;
import com.tasktracker.tasktracker.model.User;
import com.tasktracker.tasktracker.dto.TaskProgressDTO;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // 🔥 USER BASED FILTER (MAIN)
    @Query("""
        SELECT t FROM Task t
        WHERE t.user = :user
        AND (:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:status IS NULL OR t.status = :status)
        AND (:priority IS NULL OR t.priority = :priority)
    """)
    Page<Task> searchTasksByUser(
            @Param("user") User user,
            @Param("search") String search,
            @Param("status") Status status,
            @Param("priority") Priority priority,
            Pageable pageable
    );

    // 🔥 WEEKLY / MONTHLY PROGRESS
    @Query("""
        SELECT new com.tasktracker.tasktracker.dto.TaskProgressDTO(
            t.priority,
            COUNT(t)
        )
        FROM Task t
        WHERE t.createdAt >= :startDate
        GROUP BY t.priority
    """)
    List<TaskProgressDTO> countTasksByPriorityAfterDate(
            @Param("startDate") LocalDateTime startDate
    );
}