import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Assignment } from '@rspd/challenge-management/backend/common-models';
import { MockRepository } from '@rspd/shared/backend/test-util';
import {
    ActionNotPerformedException,
    AssignmentTopic,
    AssignmentType,
    IDeleteResponse,
    NoContentException,
} from '@rspd/shared/backend/utils';

import { AssignmentDto } from '../models/dto/assignment.dto';
import { AssignmentService } from './assignment.service';

describe('AssignmentService', () => {
    let service: AssignmentService;
    let assignmentRepository: MockRepository;
    const assignments: Assignment[] = [];

    beforeEach(async () => {
        for (let i = 0; i < 2; i++) {
            const testAssignment = {
                id: faker.datatype.number({ min: 0, max: 200 }).toString(),
                name: faker.lorem.words(
                    faker.datatype.number({ min: 1, max: 3 })
                ),
                type: faker.helpers.arrayElement(Object.values(AssignmentType)),
                topics: [
                    faker.helpers.arrayElement(Object.values(AssignmentTopic)),
                ],
                repositoryUrl: faker.internet.url(),
                tutorsUrl: faker.internet.url(),
                minPassedTests: faker.datatype.number({ min: 5, max: 15 }),
                totalTests: faker.datatype.number({ min: 10, max: 20 }),
            } as unknown as Assignment;
            assignments.push(testAssignment);
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AssignmentService,
                {
                    provide: getRepositoryToken(Assignment),
                    useClass: MockRepository,
                },
            ],
        }).compile();

        service = module.get<AssignmentService>(AssignmentService);
        assignmentRepository = module.get<MockRepository<Assignment>>(
            getRepositoryToken(Assignment)
        );
        assignmentRepository.entities = assignments;
    });

    it('should check if the service is defined', () => {
        expect(service).toBeDefined();
    });

    describe('createAssignment', () => {
        it('should create and return the saved assignment entity', async () => {
            const challengeId = 'challenge-id';
            const assignmentDto: AssignmentDto = {
                name: faker.lorem.words(
                    faker.datatype.number({ min: 1, max: 3 })
                ),
                type: faker.helpers.arrayElement(Object.values(AssignmentType)),
                topics: [
                    faker.helpers.arrayElement(Object.values(AssignmentTopic)),
                ],
                repositoryUrl: new URL(faker.internet.url()),
                tutorsUrl: new URL(faker.internet.url()),
                minPassedTests: faker.datatype.number({ min: 5, max: 15 }),
                totalTests: faker.datatype.number({ min: 10, max: 20 }),
            } as AssignmentDto;

            const createdAssignment = await service.createAssignment(
                challengeId,
                assignmentDto
            );

            expect(createdAssignment).toMatchObject({
                challengeId,
                ...assignmentDto,
            });
        });
    });

    describe('getAssignment', () => {
        it('should return the Assignment with the given ID', async () => {
            const assignment = await service.getAssignmentById(
                assignments[0].id
            );

            expect(assignment).toEqual(assignments[0]);
        });

        it('should throw an error if the Assignment with the given ID is not found', async () => {
            const id = '201';

            await expect(() => service.getAssignmentById(id)).rejects.toThrow(
                NoContentException
            );
        });
    });

    describe('getAssignmentById', () => {
        it('should return the Assignment with the given ID', async () => {
            assignments[0].challengeId = 'true';
            const assignment = await service.getAssignmentByChallengeId(
                assignments[0].challengeId
            );

            expect(assignment).toEqual([assignments[0]]);
        });

        it('should throw an error if the Assignment with the given ID is not found', async () => {
            const id = '201';

            await expect(() =>
                service.getAssignmentByChallengeId(id)
            ).rejects.toThrow(NoContentException);
        });
    });

    describe('deleteAssignment', () => {
        let toDeleteElement: Assignment;
        beforeEach(async () => {
            toDeleteElement = assignments[0] as Assignment;
        });

        it('should delete the assignment with the given ID', async () => {
            const expectedResponse = {
                deletedElements: toDeleteElement,
            } as IDeleteResponse<Assignment>;

            const response = await service.deleteAssignment(toDeleteElement.id);

            expect(response).toMatchObject(expectedResponse);
        });

        it('should throw an ActionNotPerformedException if the Assignment with the given ID could not be deleted', async () => {
            const id = '201';

            await expect(() => service.deleteAssignment(id)).rejects.toThrow(
                ActionNotPerformedException
            );
        });
    });

    describe('updateAssignment', () => {
        it('should update the assignment with the given ID', async () => {
            const toUpdateElement = assignments[0];
            toUpdateElement.totalTests = 12;
            toUpdateElement.name = 'changedName';

            const response = await service.updateAssignment(
                toUpdateElement.id,
                toUpdateElement
            );

            expect(response).toEqual(toUpdateElement);
        });

        it('should throw an ActionNotPerformedException if the Assignment with the given ID could not be updated', async () => {
            const id = '201';

            await expect(() =>
                service.updateAssignment(id, assignments[0])
            ).rejects.toThrow(ActionNotPerformedException);
        });
    });
});
