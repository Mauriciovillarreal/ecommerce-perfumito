class TicketRepository {
    constructor(TicketDao) {
        this.TicketDao = TicketDao
    }

    getTickets = async () => await this.TicketDao.getAll()
    getTicket = async (tid) => await this.TicketDao.get(tid)
    createTicket = async (newTicket) => await this.TicketDao.create(newTicket)
}

module.exports = TicketRepository