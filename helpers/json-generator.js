
class Status {
    get(success, code, message) {
        return { success: success, code: code, message: message }
    }
}

class Pagination {
    get(page, page_size, total, totalPages, last_index) {
        return {page: page, page_size: page_size, total: total, total_pages: totalPages, last_index: last_index}
    }
}

exports.status = new Status();
exports.pagination = new Pagination();