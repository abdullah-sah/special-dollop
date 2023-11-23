import { FC, useState, ImgHTMLAttributes } from 'react';

type Props = {
	src: string;
	alt?: string;
	width?: string | number;
	className?: string;
	fallbackSrc?: string;
	imgProps?: ImgHTMLAttributes<HTMLImageElement>;
};

const ImageLoader: FC<Props> = ({
	src,
	alt,
	fallbackSrc,
	width,
	className,
	imgProps,
}) => {
	const [imgSrc, setImgSrc] = useState<string>(src);

	const defaultImgSrc =
		'https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg';

	const handleError = () => {
		fallbackSrc ? setImgSrc(fallbackSrc) : setImgSrc(defaultImgSrc);
		console.error(
			`Image src ${imgSrc} doesn't exist. Using ${
				fallbackSrc ?? defaultImgSrc
			} as a fallback.`
		);
	};

	return (
		<img
			{...imgProps}
			src={imgSrc}
			alt={alt || ''}
			onError={handleError}
			width={width ?? ''}
			className={className}
		/>
	);
};

export default ImageLoader;
