let CODE = require('../helpers/status-code');

class Status {
    get(success, code, message) {
        return { success: success, code: code, message: message };
    }

    requireParameters(message) {
        return this.get(false, CODE.PARAM_REQUIRE, message || 'Bad request');
    }

    unauthorized(message) {
        return this.get(false, CODE.UNAUTHORIZED, message || 'Unauthorized user!');
    }

    updateDbError(code, message) {
        return this.get(false, CODE.UPDATE_ERROR, message || 'update data error');
    }

    error(code, message) {
        return this.get(false, code || CODE.ERROR, message || 'Error');
    }

    failure(code, message) {
        return this.get(false, code || CODE.FAILURE, message || 'Failure');
    }

    success(code, message) {
        return this.get(true, code || CODE.SUCCESS, message || 'Success');
    }
}

class Pagination {
    get(page, page_size, total, totalPages, last_index) {
        return {page: page, page_size: page_size, total: total, total_pages: totalPages, last_index: last_index};
    }
}

exports.status = new Status();
exports.pagination = new Pagination();