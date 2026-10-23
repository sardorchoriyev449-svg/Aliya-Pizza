import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request, Response } from "express";
import { UserRole } from './role.types';

export interface RequestWithUser extends Request {
    user: {
        id: string;
        fullName: string;
        email:string,
        role: string;
        image_url:string
        isActive:boolean
    }
}

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithUser>();
    const response = http.getResponse<Response>();
    
    const user = request.user; 

    if (!user) {
      response.redirect('/?message=Siz avtorizatsiyadan o\'tmagansiz');
      return false;
    }

    if (user.role === UserRole.admin) {
      return true; 
    }

    response.redirect('/?message=Faqat admin kiroladi');
    return false;
  }
}