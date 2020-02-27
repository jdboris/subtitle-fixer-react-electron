export function CustomElement(html) {
  let template = document.createElement("template");
  // Prevent returning a text node of whitespace as the result
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

export function Time(
  hoursOrTimestamp = 0,
  minutes = null,
  seconds = null,
  milliseconds = null
) {
  let datetime = new Date();
  datetime.setUTCFullYear(1970, 0, 1);

  if (minutes == null && seconds == null && milliseconds == null) {
    datetime.setUTCHours(0);
    datetime.setUTCMinutes(0);
    datetime.setUTCSeconds(0);
    datetime.setUTCMilliseconds(0);
    datetime.setUTCMilliseconds(hoursOrTimestamp);
    return datetime;
  } else {
    datetime.setUTCHours(hoursOrTimestamp);
    datetime.setUTCMinutes(minutes);
    datetime.setUTCSeconds(seconds);
    datetime.setUTCMilliseconds(milliseconds);
    return datetime;
  }
}

export function scaleLinear(valueToScale, oldStart, newStart, oldEnd, newEnd) {
  // f(x1)=y1
  // f(x2)=y2
  // a=(y1-y2)/(x1-x2)
  // b=y1-x1*(y1-y2)/(x1-x2)

  // f(oldStart)=newStart
  // f(oldEnd)=newEnd

  let a = (newStart - newEnd) / (oldStart - oldEnd);
  let b = newStart - (oldStart * (newStart - newEnd)) / (oldStart - oldEnd);

  return a * valueToScale + b;
}
