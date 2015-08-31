package demo.domain.note;

import javax.persistence.*;

@Entity
public class Note {
    
    @GeneratedValue
    @Id
    private Integer id;
    
    @Column
    private String title;
    
    @Column
    @Lob
    private String content;

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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
