import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { v4 as uuid } from 'uuid';
import { CreateStudentInput } from './create-student.input';
import { Repository, In } from 'typeorm';
@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}
  async createStudent(
    createStudentInput: CreateStudentInput,
  ): Promise<Student> {
    const { firstName, lastName } = createStudentInput;
    const student = this.studentRepository.create({
      id: uuid(),
      firstName,
      lastName,
    });
    return this.studentRepository.save(student);
  }
  async getStudents(): Promise<Student[]> {
    return this.studentRepository.find();
  }
  async getStudentByID(id: string): Promise<Student> {
    return this.studentRepository.findOne({ where: { id } });
  }
  async getManyStudents(studentsID: string[]): Promise<Student[]> {
    return this.studentRepository.find({
      where: {
        id: In(studentsID),
      },
    });
  }
}
