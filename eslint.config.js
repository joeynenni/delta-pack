import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'

export default tseslint.config(
	eslint.configs.recommended, tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				allowDefaultProject: true
			}
		},
		rules: {
			indent: 0,
			'no-tabs': 0,
			'space-before-function-paren': 0,
			'prefer-regex-literals': 0,
			'prettier/prettier': 2,
			'no-use-before-define': 0,
			'no-self-compare': 0,
			'@typescript-eslint/explicit-function-return-type': 2,
			'@typescript-eslint/no-empty-function': 0,
			'@typescript-eslint/no-explicit-any': 0,
			'@typescript-eslint/no-misused-promises': 0,
			'@typescript-eslint/no-unsafe-argument': 0,
			'@typescript-eslint/no-unsafe-assignment': 0,
			'@typescript-eslint/no-unsafe-call': 2,
			'@typescript-eslint/no-unsafe-member-access': 2,
			'@typescript-eslint/no-unused-vars': 2,
			'@typescript-eslint/no-var-requires': 0,
			'@typescript-eslint/restrict-template-expressions': 0
		},
		plugins: {
			prettier: prettier
		}
	},
	{
		ignores: ['dist', 'eslint.config.js', 'jest.config.js']
	}
)
