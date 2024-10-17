import fs from "fs";
import path from "path";
import Image from "next/image";

import matter from "gray-matter";
import Link from "next/link";

function formatDate(date: string | Date) {
  const d = new Date(date);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

interface Post {
  description: string;
  slug: string;
  title: string;
  date: string;
  image: string;
}

export default function BlogPage() {
  const postsDirectory = path.join(process.cwd(), "public/posts");
  let posts: Post[] = [];

  try {
    const fileNames = fs.readdirSync(postsDirectory);
    posts = fileNames.reduce<Post[]>((acc, fileName) => {
      const fullPath = path.join(postsDirectory, fileName);

      // Skip directories
      if (fs.statSync(fullPath).isDirectory()) {
        return acc;
      }

      try {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);

        acc.push({
          slug: fileName.replace(/\.md$/, ""),
          title: data.title,
          date: formatDate(data.date),
          image: data.image,
          description: data.description,
        });
      } catch (error) {
        console.error(`Error reading file ${fileName}:`, error);
      }

      return acc;
    }, []);
  } catch (error) {
    console.error("Error reading blog posts directory:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="text-xl font-semibold hover:underline"
            >
              <Image height={350} width={350} src={post.image} alt={post.title} />
              {post.title}
            </Link>
            <p className="text-gray-700 mt-2 mb-3">{post.description || "No description available."}</p>
            <p className="text-gray-600">{post.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
