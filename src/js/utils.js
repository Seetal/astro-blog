export function formatDate(date) {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long"});
    const year = dateObj.getFullYear();

    const nthNumber = (number) => {
        if (number > 3 && number < 21) return "th";
        switch (number % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
    };

    return `${day}${nthNumber(day)} ${month}, ${year}`;
}

export function orderByDate(posts) {
  posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
  return posts;
}

export function slugify(str) {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
}