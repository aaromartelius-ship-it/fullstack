const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((favorite, blog) => {
    return (blog.likes > (favorite.likes || 0)) ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const blogCounts = {}
  blogs.forEach(blog => {
    blogCounts[blog.author] = (blogCounts[blog.author] || 0) + 1
  })

  let topAuthor = ''
  let maxCount = 0

  for (const [author, count] of Object.entries(blogCounts)) {
    if (count > maxCount) {
      maxCount = count
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: maxCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likeCounts = {}
  blogs.forEach(blog => {
    likeCounts[blog.author] = (likeCounts[blog.author] || 0) + (blog.likes || 0)
  })

  let topAuthor = ''
  let maxLikes = 0

  for (const [author, likes] of Object.entries(likeCounts)) {
    if (likes > maxLikes) {
      maxLikes = likes
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}