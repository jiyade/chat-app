export function formatTime(ISOString) {
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ]

    const d = new Date(ISOString)
    let fullDate = d.toLocaleString()
    fullDate = fullDate.split(',')

    let date = fullDate[0].split('/')
    let month = date[1]

    month = monthNames[month - 1]
    date[1] = month
    date = date.join(' ')

    let time = fullDate[1]
    time = time.split(':')

    let hours = time[0]
    let session

    if (hours > 12) {
        hours -= 12
        session = 'PM'
    } else {
        let splittedHours = hours.split('')
        if (hours < 10) {
            hours = splittedHours[2]
        }
        session = 'AM'
    }

    time[0] = hours

    time.splice(-1)
    time = time.join(':')
    time = `${time} ${session}`

    return { date, time }
}

