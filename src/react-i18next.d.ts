import 'react-i18next';
import ru from './locales/en';

declare module 'react-i18next' {
	interface CustomTypeOptions {
		defaultNS: 'common';
		resources: typeof ru;
	}
}
