
class ResponseJson {

    constructor(){
        this.clear()
    }

    clear(){
        this._status = undefined
        this._data = undefined
        this._pagination = undefined
    }

    status(error, code, message) {
        this._status = {error: error, code: code, message: message}
    }

    data(data) {
        this._data = data
    }

    pagination(page, page_size, total) {
      this._pagination = {page: page, page_size: page_size ,total: total}
    }

    render() {
      return {status: this._status, pagination: this._pagination, data: this._data}
    }
}

exports.ResponseJson = new ResponseJson()