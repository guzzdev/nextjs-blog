import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Markdown from "react-markdown";
import Image from "next/image";

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "public/posts");
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.md$/, ""),
  }));
}

function formatDate(date: any) {
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

export default function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const fullPath = path.join(process.cwd(), "public/posts", `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const formattedDate = formatDate(data.date);

  return (
    <div>
      <article className="max-w-4xl mx-auto px-4 py-12">
        {data.headerImage && (
          <div className="mb-12 relative h-72 md:h-96 lg:h-[28rem]">
            <Image
              src={data.headerImage}
              alt={data.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-xl shadow-lg"
            />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{data.title}</h1>
        <div className="flex items-center text-gray-600 mb-8 text-lg">
          <span className="mr-4">{formattedDate}</span>
          <span>By {data.author}</span>
        </div>
        <Markdown>{content}</Markdown>
      </article>
    </div>
  );
}
