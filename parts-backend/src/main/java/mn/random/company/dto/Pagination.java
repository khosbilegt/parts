package mn.random.company.dto;

public class Pagination {
    private final int pageSize;
    private final int pageOffset;

    public Pagination(int pageSize, int pageOffset) {
        this.pageSize = Math.max(pageSize, 10);
        this.pageOffset = (pageSize > 0) ? (pageOffset / pageSize) * pageSize : 0;
    }

    public int getPageSize() {
        return pageSize;
    }

    public int getPageOffset() {
        return pageOffset;
    }

    public int getRowOffset() {
        return pageSize * pageOffset;
    }

    @Override
    public String toString() {
        return "Pagination{" +
                "pageSize=" + pageSize +
                ", pageOffset=" + pageOffset +
                '}';
    }
}
