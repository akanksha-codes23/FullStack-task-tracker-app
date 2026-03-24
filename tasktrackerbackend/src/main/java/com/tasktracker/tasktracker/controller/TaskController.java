package com.tasktracker.tasktracker.controller;

import org.springframework.data.domain.Page;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;

import com.tasktracker.tasktracker.dto.TaskProgressDTO;
import org.springframework.data.domain.Sort;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tasktracker.tasktracker.dto.TaskResponseDTO;
import com.tasktracker.tasktracker.exceptions.ResourceNotFoundException;
import com.tasktracker.tasktracker.mapper.TaskMapper;
import com.tasktracker.tasktracker.model.Task;
import com.tasktracker.tasktracker.model.User;
import com.tasktracker.tasktracker.repository.TaskRepository;
import com.tasktracker.tasktracker.repository.UserRepository;
import com.tasktracker.tasktracker.security.JwtUtil;
import com.tasktracker.tasktracker.model.Status;
import com.tasktracker.tasktracker.model.Priority;

@CrossOrigin(origins = "https://tasktrackerfronten.netlify.app")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskMapper taskMapper;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    // CREATE TAS
    @PostMapping
    public Task createTask(@RequestBody Task task, HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        task.setUser(user);

        return taskRepository.save(task);
    }

    //GET ALL TASKS
    @GetMapping
    public Page<TaskResponseDTO> getAllTasks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.DESC)
            Pageable pageable,
            HttpServletRequest request
    ) {

        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Page<Task> page = taskRepository.searchTasksByUser(
                user,
                (search == null || search.isBlank()) ? null : search,
                status,
                priority,
                pageable
        );

        return page.map(taskMapper::toResponse);
    }

    //UPDATE TASK
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody Task updatedTask,
            HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Task not found with id " + id));

        //SECURITY CHECK
        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        //UPDATE FIELDS
        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setStatus(updatedTask.getStatus());
        task.setPriority(updatedTask.getPriority());
        task.setDueDate(updatedTask.getDueDate());

        Task saved = taskRepository.save(task);

        return ResponseEntity.ok(saved);
    }

    //DELETE TASK
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Task not found with id " + id));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        taskRepository.delete(task);

        return ResponseEntity.noContent().build();
    }

    //PROGRESS
    @GetMapping("/progress/weekly")
    public List<TaskProgressDTO> weeklyProgress() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        return taskRepository.countTasksByPriorityAfterDate(startDate);
    }

    @GetMapping("/progress/monthly")
    public List<TaskProgressDTO> monthlyProgress() {
        LocalDateTime startDate = LocalDateTime.now()
                .withDayOfMonth(1)
                .withHour(0)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        return taskRepository.countTasksByPriorityAfterDate(startDate);
    }
}