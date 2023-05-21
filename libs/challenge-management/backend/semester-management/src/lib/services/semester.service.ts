import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Semester } from '@rspd/challenge-management/backend/common-models';
import { GenericRepositoryService } from '@rspd/shared/backend/utils';
import { Repository } from 'typeorm';

import { SemesterDto } from '../models/semester.dto';

@Injectable()
export class SemesterService extends GenericRepositoryService<Semester> {
	constructor(
		@InjectRepository(Semester)
		private readonly _semesterRepository: Repository<Semester>,
	) {
		super(_semesterRepository);
	}

	/**
	 * Creates a new semester based on the provided SemesterDto.
	 *
	 * @param {SemesterDto} semester - The SemesterDto containing the semester data.
	 * @returns {Promise<Semester>} The created semester.
	 */
	async createSemester(semester: SemesterDto) {
		let semesterName = undefined;
		if (semester.start.getMonth() >= 8 && semester.end.getMonth() <= 4) {
			semesterName = `WS-${semester.start.getUTCFullYear()}`;
		} else if (semester.start.getMonth() <= 4 && semester.end.getMonth() <= 8) {
			semesterName = `SS-${semester.start.getUTCFullYear()}`;
		}
		return await this.create(
			{
				start: semester.start,
				end: semester.end,
				name: semesterName,
			} as Semester,
			{
				name: semesterName,
			},
		);
	}

	/**
	 * Updates an existing semester with the provided semester data.
	 *
	 * @param {string} name - The name of the semester to update.
	 * @param {SemesterDto} semesterDto - The SemesterDto containing the updated semester data.
	 * @returns {Promise<Semester>} The updated semester.
	 */
	async updateSemester(name: string, semesterDto: SemesterDto) {
		const semester = await this.findByName(name);
		return await this.update(semester.id, {
			...semester,
			...semesterDto,
		});
	}

	/**
	 * Deletes the semester with the specified name.
	 *
	 * @param {string} name - The name of the semester to delete.
	 * @returns {Promise<void>}
	 */
	async deleteSemester(name: string) {
		const semester = await this.findByName(name);
		return await this.delete(semester.id);
	}

	/**
	 * Finds a semester by its name.
	 *
	 * @param {string} name - The name of the semester to find.
	 * @returns {Promise<Semester>} The found semester.
	 */
	async findByName(name: string) {
		return await this.findOptions({
			where: {
				name,
			},
		});
	}

	/**
	 * Finds a semester by its name.
	 *
	 * @param {string} name - The name of the semester to find.
	 * @returns {Promise<Semester>} The found semester.
	 */
	async getCurrentSemester(): Promise<Semester> {
		return await this.findAll().then((ele) =>
			ele.find((semester) => {
				if (
					semester.start.getTime() <= Date.now() &&
					semester.end.getTime() >= Date.now()
				) {
					return semester;
				}
			}),
		);
	}
}
