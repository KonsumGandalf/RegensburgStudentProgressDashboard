import { FormControl } from '@angular/forms';

import { AuthInputValidator } from './auth-input.validator';

describe('AuthInputValidator', () => {
	describe('validateEmailDomain', () => {
		it('should return null for valid domain', () => {
			const control = new FormControl('test@st.oth-regensburg.de');

			const result = AuthInputValidator.validateEmailDomain(control);

			expect(result).toBeNull();
		});

		it('should return an error object for invalid domain', () => {
			const control = new FormControl('test@invalid.com');

			const result = AuthInputValidator.validateEmailDomain(control);

			expect(result).toEqual({ invalidDomain: true });
		});

		it('should return null for empty value', () => {
			const control = new FormControl('');

			const result = AuthInputValidator.validateEmailDomain(control);

			expect(result).toEqual({ invalidDomain: true });
		});
	});
});
