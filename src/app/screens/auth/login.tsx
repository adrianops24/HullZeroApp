import {
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import '../../../../global.css';
import { z } from 'zod';
import { loginSchema } from '../../../constants/schemas/loginSchema';
import { Controller, type FieldPath, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import clsx from 'clsx';
import { router } from 'expo-router';
import { Checkbox } from 'expo-checkbox';
import { useDeviceSize } from '~/src/lib/hooks/useResponsiveValues';
import { useAuthStore } from '~/src/store/auth/authStore';
import { LoginRequest } from '~/src/types/auth';
import { showSuccessToast } from '~/src/lib/hooks/useNotificated';
import LoadingOverlay from '~/src/components/LoadingOverlay';
type loginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { isSmall, isMedium, isLarge } = useDeviceSize();
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<loginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      credentials: { email: '', password: '' },
      terms: { isRememberMeChecked: false }
    }
  });

  const { login, loading, rememberedEmail } = useAuthStore();

  useEffect(() => {
    if (rememberedEmail) {
      setValue('credentials.email', rememberedEmail);
    }
  }, [rememberedEmail, setValue]);

  const onSubmit = async (data: loginFormData) => {
    try {
      const loginRequest: LoginRequest = {
        email: data.credentials.email,
        password: data.credentials.password
      };

      await login(loginRequest, { rememberMe: !!data.terms?.isRememberMeChecked });
      router.replace('/home');
      showSuccessToast('Login realizado com sucesso!');
    } catch (error) {
      console.log('Registration failed:', error);
    }
  };
  const renderInput = (
    name: `credentials.${keyof loginFormData['credentials']}`,
    placeholder: string,
    keyboardType: 'default' | 'numeric' | 'email-address' = 'default',
    options?: {
      maxLength?: number;
      secureTextEntry?: boolean;
      toggleVisibility?: () => void;
      isVisible?: boolean;
    }
  ) => (
    <Controller
      control={control}
      name={name as FieldPath<loginFormData>}
      render={({ field: { onChange, onBlur, value } }) => (
        <View className="flex-row items-center bg-[#EEEEF3] rounded-xl border border-[#90909E]">
          <TextInput
            className="flex-1 ml-3 text-base text-black"
            placeholder={placeholder}
            placeholderTextColor="#90909E"
            keyboardType={keyboardType}
            maxLength={options?.maxLength}
            secureTextEntry={options?.secureTextEntry && !options?.isVisible}
            onBlur={onBlur}
            maxFontSizeMultiplier={1}
            value={value as string}
            onChangeText={(text) => {
              onChange(text);

              if (name === 'credentials.email') {
                const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
                console.log(`Email ${isValidEmail ? 'válido' : 'inválido'}: ${text}`);
              }
              if (name === 'credentials.password') {
                const isValidPassword = text.length >= 6;
                console.log(`Senha ${isValidPassword ? 'válida' : 'inválida'}: ${text}`);
              }
            }}
          />
          {options?.toggleVisibility && (
            <TouchableOpacity onPress={options.toggleVisibility} className="p-4">
              <AntDesign name={options.isVisible ? 'eye' : 'eyeo'} size={18} color="#90909E" />
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );

  return (
    <View className="flex-1 bg-slate-800">
      {/* View superior - 1/3 da tela - Background */}
      <View className="flex-[0.5]">{/* Conteúdo da parte superior (logo, imagem, etc) */}</View>

      {/* View inferior - 2/3 da tela - Conteúdo com rounded */}
      <View className="flex-[2] bg-white rounded-t-3xl overflow-hidden">
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
          <View
            className={clsx(
              'absolute  left-5 w-full z-40  flex-row items-center justify-between',
              isSmall && 'w-12 h-20',
              isMedium && 'w-16 h-12',
              isLarge && 'w-20 h-40'
            )}
          ></View>
          <View className={clsx('flex-1 p-4', isSmall && ' top-4', isMedium && ' ', isLarge && ' top-48')}>
            <Text
              className={clsx(
                ' font-montserrat font-bold text-center text-[#1A1B41] mb-8 mt-8',
                isSmall && 'text-2xl',
                isMedium && 'text-3xl',
                isLarge && 'text-4xl'
              )}
            >
              Faça seu acesso
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ justifyContent: 'center' }}
            >
              <View className="gap-y-3 ]">
                {renderInput('credentials.email', 'Usuário', 'email-address')}
                <View className="min-h-[8px]">
                  {errors.credentials?.email && (
                    <Text
                      className={clsx(
                        'text-red-500 -mt-3 ml-1',
                        isSmall && 'text-xs',
                        isMedium && 'text-md',
                        isLarge && 'text-md'
                      )}
                    >
                      {errors.credentials?.email?.message}
                    </Text>
                  )}
                </View>

                {renderInput('credentials.password', 'Senha', 'default', {
                  secureTextEntry: true,
                  toggleVisibility: () => setPasswordVisible(!isPasswordVisible),
                  isVisible: isPasswordVisible
                })}
                <View className="min-h-[6px]">
                  {errors.credentials?.password && (
                    <Text
                      className={clsx(
                        'text-red-500 -mt-3 ml-1',
                        isSmall && 'text-xs',
                        isMedium && 'text-md',
                        isLarge && 'text-md'
                      )}
                    >
                      {errors.credentials?.password?.message}
                    </Text>
                  )}
                </View>
              </View>

              <View className="flex-row justify-between w-full items-center  mt-4">
                <Controller
                  control={control}
                  name="terms.isRememberMeChecked"
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-row items-center">
                      <Checkbox
                        className="ml-1 border"
                        value={value}
                        onValueChange={onChange}
                        color={value ? '#0066CC' : undefined}
                      />
                      <Text
                        className={clsx(
                          'text-[#90909E] font-semibold ml-2',
                          isSmall && 'text-xs',
                          isMedium && 'text-md',
                          isLarge && 'text-xl'
                        )}
                      >
                        Lembrar-me
                      </Text>
                    </View>
                  )}
                />
                <TouchableOpacity>
                  <Text
                    className={clsx(
                      'text-[#1A1B41] font-bold mr-2',
                      isSmall && 'text-xs',
                      isMedium && 'text-md',
                      isLarge && 'text-xl'
                    )}
                  >
                    Esqueceu a senha?
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mt-8 w-full items-center">
                <TouchableOpacity
                  className={clsx(
                    'w-full rounded-[12px] bg-[#0066CC] py-3 items-center',
                    isSmall && 'max-w-[120px] max-h-[50px]',
                    isMedium && 'max-w-[140px] max-h-[50px]',
                    isLarge && 'max-w-[160px] max-h-[50px]'
                  )}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting || loading}
                >
                  <Text
                    className={clsx(
                      'font-semibold text-white',
                      isSmall && 'text-xl leading-snug',
                      isMedium && 'text-2xl leading-tight',
                      isLarge && 'text-2xl leading-tight'
                    )}
                  >
                    {isSubmitting || loading ? 'Entrando...' : 'Entrar'}
                  </Text>
                </TouchableOpacity>

                <View
                  className={clsx(
                    'flex-row justify-center items-center ',
                    isSmall && 'mt-7',
                    isMedium && 'mt-7',
                    isLarge && 'mt-10'
                  )}
                >
                  <TouchableOpacity onPress={() => router.push('/screens/auth/register')}>
                    <Text
                      allowFontScaling={false}
                      className={clsx(
                        'font-bold text-[#1A1B41]',
                        isSmall && 'text-xs ',
                        isMedium && 'text-md ',
                        isLarge && 'text-xl '
                      )}
                    >
                      <Text className="text-[#1A1B41]">Usuário padrão:</Text>
                      <Text className="text-[#0066CC]"> admin </Text>
                      <Text className="text-[#1A1B41]">/ Senha:</Text>
                      <Text className="text-[#FF6B6B]"> admin123</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
