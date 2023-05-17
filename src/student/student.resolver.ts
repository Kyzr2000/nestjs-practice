import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateStudentInput } from './create-student.input';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { StudentType } from './student.type';

@Resolver((of) => StudentType)
export class StudentResolver {
  constructor(private studentService: StudentService) {}
  @Mutation((returns) => StudentType)
  createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
  ): Promise<Student> {
    return this.studentService.createStudent(createStudentInput);
  }
  @Query((returns) => [StudentType])
  students(): Promise<Student[]> {
    return this.studentService.getStudents();
  }
  @Query((returns) => StudentType)
  student(@Args('id') id: string): Promise<Student> {
    return this.studentService.getStudentByID(id);
  }
}
