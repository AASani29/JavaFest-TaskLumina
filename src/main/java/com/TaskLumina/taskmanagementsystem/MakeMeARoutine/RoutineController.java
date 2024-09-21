package com.TaskLumina.taskmanagementsystem.MakeMeARoutine;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/adminuser/routine")
public class RoutineController {

    @Autowired
    private RoutineService routineService;

    @PostMapping("/generate")
    public ResponseEntity<RoutineResponse> generateRoutine(@RequestBody RoutineRequest request) {
        RoutineResponse response = routineService.generateRoutine(request);
        return ResponseEntity.ok(response);
    }
}
