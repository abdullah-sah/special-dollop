import { FC } from 'react';
import type { IconProps } from './types';

const AddItemIcon: FC<IconProps> = ({ className }) => {
	return (
		<svg
			clipRule='evenodd'
			fillRule='evenodd'
			strokeLinejoin='round'
			strokeMiterlimit='2'
			viewBox='0 0 24 24'
			xmlns='http://www.w3.org/2000/svg'
			className={`fill-white ${className}`}
		>
			<path
				d='m12.002 2c5.518 0 9.998 4.48 9.998 9.998 0 5.517-4.48 9.997-9.998 9.997-5.517 0-9.997-4.48-9.997-9.997 0-5.518 4.48-9.998 9.997-9.998zm-.747 9.25h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z'
				fillRule='nonzero'
			/>
		</svg>
	);
};

export default AddItemIcon;
