package co.com.Sofka.c4Dev.CrudBackend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ToDoController {

    @Autowired
    private ToDoService service;

    @GetMapping(value = "api/todos")
    public Iterable<ToDo> list(){
        return service.list();
    }

    @GetMapping(value = "api/todo/{id}")
    public ToDo get(@PathVariable("id") Long id){
        return service.get(id);
    }

    @PostMapping(value = "api/todo")
    public ToDo save(@RequestBody ToDo todo){
        return service.save(todo);
    }

    @PutMapping(value = "api/todo")
    public ToDo update(@RequestBody ToDo todo){
        if(todo.getId() != null){
            return service.save(todo);
        }
        throw new RuntimeException("No existe el id de la actividad a actualizar");
    }

    @DeleteMapping(value = "api/todo/{id}")
    public void delete(@PathVariable("id") Long id){
        service.delete(id);
    }
}
