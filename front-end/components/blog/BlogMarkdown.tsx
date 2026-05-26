import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
	content: string;
}

export default function BlogMarkdown({ content }: Props) {
	return (
		<Markdown
			remarkPlugins={[remarkGfm]}
			components={{
				h1: (props) => <h1 className="text-3xl font-bold text-white mt-2 mb-4" {...props} />,
				h2: (props) => <h2 className="text-2xl font-bold text-white mt-2 mb-3" {...props} />,
				h3: (props) => <h3 className="text-xl font-semibold text-white mt-2 mb-3" {...props} />,
				h4: (props) => <h4 className="text-lg font-semibold text-white mt-2 mb-2" {...props} />,
				p: (props) => <p className="text-zinc-300 leading-relaxed mb-4" {...props} />,
				a: (props) => (
					<a
						className="text-green-400 underline hover:text-green-300 transition-colors"
						target={props.href?.startsWith("http") ? "_blank" : undefined}
						rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
						{...props}
					/>
				),
				ul: (props) => <ul className="list-disc list-outside ml-6 mb-4 text-zinc-300" {...props} />,
				ol: (props) => <ol className="list-decimal list-outside ml-6 mb-4 text-zinc-300" {...props} />,
				li: (props) => <li className="mb-1" {...props} />,
				blockquote: (props) => (
					<blockquote className="border-l-4 border-zinc-700 pl-4 italic text-zinc-400 my-4" {...props} />
				),
				code: ({ className, children, ...rest }) => {
					const isInline = !className;
					if (isInline) {
						return (
							<code className="bg-zinc-800 text-green-400 px-1.5 py-0.5 rounded text-sm" {...rest}>
								{children}
							</code>
						);
					}

					return (
						<code className={`${className} block`} {...rest}>
							{children}
						</code>
					);
				},
				pre: (props) => (
					<pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto mb-4 text-sm" {...props} />
				),
				img: ({ src, alt }) => (
					<img src={src} alt={alt ?? ""} className="rounded-lg my-4 mx-auto max-w-full" />
				),
				em: (props) => <em className="text-zinc-500 text-sm block text-center" {...props} />,
				hr: () => <hr className="border-zinc-800 my-8" />,
			}}
		>
			{content}
		</Markdown>
	);
}
