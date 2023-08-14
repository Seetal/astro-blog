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

// export function formatBlogPosts(posts, {
//   sortByDate = true,
//   limit = undefined
// } = {}) {
//   // const filteredPosts = posts.reduce((acc, post) => {
//   //   const { date } = post.frontmatter;
//   // }, [])
//   if(sortByDate) {
//     posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
//   }
// }

export function orderByDate(posts) {
  posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
  return posts;
}