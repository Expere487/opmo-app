import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validatePassword, validateEmail, validateUsername } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password, teamName } = await request.json();

    // Input validation
    if (!email || !username || !password || !teamName) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    // Email validation
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    // Username validation
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return NextResponse.json(
        { error: usernameValidation.message },
        { status: 400 }
      );
    }

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Team name validation
    if (teamName.length < 2) {
      return NextResponse.json(
        { error: 'Takım adı en az 2 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUserByEmail = await prisma.users.findFirst({
      where: { user_mail: email }
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    const existingUserByUsername = await prisma.users.findFirst({
      where: { username: username }
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and team in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.users.create({
        data: {
          username,
          user_mail: email,
          hashedPassword,
          name: username, // Next Auth için name field'ı
        },
      });

      // Create team
      const team = await tx.teams.create({
        data: {
          team_name: teamName,
        },
      });

      // Add user to team as owner
      await tx.team_users.create({
        data: {
          team_id: team.id,
          user_id: user.id,
          role: 'owner',
        },
      });

      return { user, team };
    });

    return NextResponse.json(
      {
        message: 'Kayıt başarılı',
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.user_mail,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 