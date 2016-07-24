package demo.domain.category;

import demo.domain.note.Note;

import javax.persistence.*;
import java.util.List;

@Entity
public class Category {
    @GeneratedValue
    @Id
    private Integer id;

    @Column
    private String title;

    @OneToMany(mappedBy = "category", cascade = CascadeType.REMOVE)
    private List<Note> notes;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Note> getNotes() {
        return notes;
    }

    public void setNotes(List<Note> notes) {
        this.notes = notes;
    }
}
