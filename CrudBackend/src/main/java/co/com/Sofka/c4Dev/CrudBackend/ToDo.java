package co.com.Sofka.c4Dev.CrudBackend;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class ToDo {

    @Id
    @GeneratedValue
    private Long id;
    private String nombre;
    private Boolean isCompleted;public ToDo(Long id, String nombre, Boolean isCompleted) {
        this.id = id;
        this.nombre = nombre;
        this.isCompleted = isCompleted;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Boolean getCompleted() {
        return isCompleted;
    }

    public void setCompleted(Boolean completed) {
        isCompleted = completed;
    }
}
