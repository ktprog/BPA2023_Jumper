class AdvancedDate extends Date
{
    constructor()
    {
        super();
    }
    NowToDatetime()
    {
        return toISOString().slice(0, 19).replace('T', ' ');
    }
}

module.exports = {AdvancedDate};