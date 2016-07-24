package demo.domain.note;

import demo.domain.category.Category;

import javax.persistence.*;

@Entity
public class Note {

    @GeneratedValue
    @Id
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Boolean done = Boolean.FALSE;

    @ManyToOne(optional = false)
    private Category category;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Boolean getDone() {
        return done;
    }

    public void setDone(Boolean done) {
        this.done = done;
    }
}
