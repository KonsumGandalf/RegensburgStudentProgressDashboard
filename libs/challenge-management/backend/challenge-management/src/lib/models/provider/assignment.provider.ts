export abstract class AssignmentProvider<Result = never> {
    abstract create(assignment: never): Promise<Result>;
}
