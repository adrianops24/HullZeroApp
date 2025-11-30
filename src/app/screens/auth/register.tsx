import { Text, TextInput, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import '../../../../global.css';
import { z } from 'zod';
import { registerSchema } from '../../../constants/schemas/registerSchema';
import { Controller, type FieldPath, useForm } from 'react-hook-form';
import { Checkbox } from 'expo-checkbox';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import clsx from 'clsx';
import { useDeviceSize } from '~/src/lib/hooks/useResponsiveValues';
import { useAuthStore } from '~/src/store/auth/authStore';
import { router } from 'expo-router';
import { RegisterRequest } from '~/src/types/auth';
import { PhoneNumberType } from '~/src/enums/phone-number';
import { showSuccessToast } from '~/src/lib/hooks/useNotificated';
import LoadingOverlay from '~/src/components/LoadingOverlay';

type RegisterFormData = z.infer<typeof registerSchema>;

const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatPhone = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '');

  if (digitsOnly.length > 8) {
    return digitsOnly.slice(0, 9).replace(/(\d{5})(\d)/, '$1-$2');
  } else {
    return digitsOnly.replace(/(\d{4})(\d)/, '$1-$2');
  }
};

const formatCEP = (value: string) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
};

export default function SignUpForm() {
  const { isSmall, isMedium, isLarge } = useDeviceSize();
  const { register, loading } = useAuthStore();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const formattedCPF = data.user.cpf.replace(/\D/g, '');

      const formattedBirthdate = data.user.birthDate ? data.user.birthDate.toISOString().split('T')[0] : '';

      const formattedPhoneNumber = (data.phone.DDD + data.phone.phoneNumber).replace(/\D/g, '');

      const formattedPostalCode = data.address.postalCode.replace(/\D/g, '');

      const registerRequest: RegisterRequest = {
        credentials: {
          email: data.credentials.email,
          password: data.credentials.password
        },
        profile: {
          fullName: data.user.fullName,
          cpf: formattedCPF,
          nickname: data.user.nickName,
          birthdate: formattedBirthdate as unknown as Date
        },
        phoneNumbers: [
          {
            countryCode: '55',
            number: formattedPhoneNumber,
            type: PhoneNumberType.MOBILE
          }
        ],
        addresses: [
          {
            countryCode: 'BR',
            postalCode: formattedPostalCode,
            lineAddress: data.address.lineAddress
          }
        ]
      };

      await register(registerRequest, { rememberMe: !!data.terms?.isRememberMeChecked });
      router.replace('/home');
      showSuccessToast('Cadastro realizado com sucesso!');
    } catch (error) {
      console.log('Registration failed:', error);
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      user: { fullName: '', cpf: '', nickName: '', birthDate: undefined },
      credentials: { email: '', password: '', confirmedPassword: '' },
      phone: { DDD: '', phoneNumber: '' },
      address: { countryCode: '', postalCode: '', lineAddress: '' },
      terms: { isChecked: false, isRememberMeChecked: false }
    }
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const isTermsChecked = watch('terms.isChecked');
  const renderInput = (
    name:
      | `user.${keyof RegisterFormData['user']}`
      | `credentials.${keyof RegisterFormData['credentials']}`
      | `phone.${keyof RegisterFormData['phone']}`
      | `address.${keyof RegisterFormData['address']}`,
    placeholder: string,
    keyboardType: 'default' | 'numeric' | 'email-address' = 'default',
    options?: {
      maxLength?: number;
      secureTextEntry?: boolean;
      toggleVisibility?: () => void;
      isVisible?: boolean;
      mask?: (value: string) => string;
    }
  ) => (
    <Controller
      control={control}
      name={name as FieldPath<RegisterFormData>}
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
              onChange(options?.mask ? options.mask(text) : text);
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
    <View className="flex-1 bg-[#EEEEF3] p-4">
      <View className="items-center mb-2"></View>

      <Text
        className={clsx(
          'font-montserrat font-bold text-center text-[#1A1B41]',
          isSmall && 'text-2xl leading-snug',
          isMedium && 'text-3xl leading-tight',
          isLarge && 'text-3xl leading-tight'
        )}
      >
        Cadastre-se
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-y-4 mb-6">
          {renderInput('user.fullName', 'Nome Completo')}
          {errors.user?.fullName && (
            <Text maxFontSizeMultiplier={1.15} className="text-red-500 -mt-4 ml-1">
              {errors.user.fullName.message}
            </Text>
          )}

          {renderInput('user.cpf', 'CPF', 'numeric', { maxLength: 14, mask: formatCPF })}
          {errors.user?.cpf && (
            <Text maxFontSizeMultiplier={1.15} className="text-red-500 -mt-4 ml-1">
              {errors.user.cpf.message}
            </Text>
          )}

          {renderInput('user.nickName', 'Como gostaria de ser chamado?')}
          {errors.user?.nickName && (
            <Text maxFontSizeMultiplier={1.15} className="text-red-500 -mt-4 ml-1">
              {errors.user.nickName.message}
            </Text>
          )}

          <Controller
            control={control}
            name="user.birthDate"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="flex-row items-center justify-between bg-[#EEEEF3] p-3 rounded-xl border border-[#90909E]"
                >
                  <Text
                    maxFontSizeMultiplier={1}
                    className={value ? 'text-black text-base' : 'text-[#90909E] text-base'}
                  >
                    {value ? value.toLocaleDateString('pt-BR') : 'Data de Nascimento'}
                  </Text>

                  <AntDesign name="calendar" size={20} color="#90909E" />
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (selectedDate) onChange(selectedDate);
                    }}
                  />
                )}
              </>
            )}
          />
          {errors.user?.birthDate && (
            <Text maxFontSizeMultiplier={1.15} className="text-red-500 -mt-4 ml-1">
              {errors.user.birthDate.message}
            </Text>
          )}
          {renderInput('credentials.email', 'E-mail', 'email-address')}
          {errors.credentials?.email && (
            <Text maxFontSizeMultiplier={1.15} className="text-red-500 -mt-4 ml-1">
              {errors.credentials.email.message}
            </Text>
          )}

          <View className="flex-row gap-x-16">
            <View className="flex-1">
              {renderInput('phone.DDD', 'DDD', 'numeric', { maxLength: 2 })}
              {errors.phone?.DDD && (
                <Text maxFontSizeMultiplier={1.15} className="text-red-500 ml-1">
                  {errors.phone.DDD.message}
                </Text>
              )}
            </View>
            <View className="flex-1">
              {renderInput('phone.phoneNumber', 'Celular', 'numeric', { maxLength: 10, mask: formatPhone })}
              {errors.phone?.phoneNumber && (
                <Text maxFontSizeMultiplier={1.15} className="text-red-500 ml-1">
                  {errors.phone.phoneNumber.message}
                </Text>
              )}
            </View>
          </View>

          {renderInput('address.postalCode', 'CEP', 'numeric', { maxLength: 9, mask: formatCEP })}
          {errors.address?.postalCode && (
            <Text maxFontSizeMultiplier={1.15} className="text-red-500 -mt-4 ml-1">
              {errors.address.postalCode.message}
            </Text>
          )}

          {renderInput('address.lineAddress', 'Endereço')}
          {errors.address?.lineAddress && (
            <Text maxFontSizeMultiplier={1.15} className="text-red-500 -mt-4 ml-1">
              {errors.address.lineAddress.message}
            </Text>
          )}

          {renderInput('credentials.password', 'Senha', 'default', {
            secureTextEntry: true,
            toggleVisibility: () => setPasswordVisible(!isPasswordVisible),
            isVisible: isPasswordVisible
          })}
          {errors.credentials?.password && (
            <Text maxFontSizeMultiplier={1.15} className="text-red-500 -mt-4 ml-1">
              {errors.credentials.password.message}
            </Text>
          )}

          {renderInput('credentials.confirmedPassword', 'Confirmar senha', 'default', {
            secureTextEntry: true,
            toggleVisibility: () => setConfirmPasswordVisible(!isConfirmPasswordVisible),
            isVisible: isConfirmPasswordVisible
          })}
          {errors.credentials?.confirmedPassword && (
            <Text maxFontSizeMultiplier={1.15} className="text-red-500 -mt-4 ml-1">
              {errors.credentials.confirmedPassword.message}
            </Text>
          )}

          <View className="gap-y-1">
            <View className="flex-row justify-between items-center">
              <Controller
                control={control}
                name="terms.isRememberMeChecked"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center">
                    <Checkbox
                      className="border"
                      value={value}
                      onValueChange={onChange}
                      color={value ? '#FAC03B' : undefined}
                    />
                    <Text
                      maxFontSizeMultiplier={1}
                      allowFontScaling={false}
                      className={clsx(
                        'text-[#90909E]',
                        isSmall && 'text-xs ml-2 leading-snug',
                        isMedium && 'text-md ml-3 leading-tight',
                        isLarge && 'text-xl ml-4 leading-tight'
                      )}
                    >
                      Lembrar-me
                    </Text>
                  </View>
                )}
              />
              <Controller
                control={control}
                name="terms.isChecked"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center">
                    <Checkbox
                      className="border"
                      value={value}
                      onValueChange={onChange}
                      color={value ? '#FAC03B' : undefined}
                    />
                    <Text
                      maxFontSizeMultiplier={1}
                      allowFontScaling={false}
                      className={clsx(
                        'text-[#90909E] ',
                        isSmall && 'text-xs ml-2 leading-snug',
                        isMedium && 'text-md ml-3 leading-tight',
                        isLarge && 'text-xl ml-4 leading-tight'
                      )}
                    >
                      Termo de Condições{' '}
                    </Text>
                  </View>
                )}
              />
            </View>
            <View className="min-h-[30px] items-end">
              {errors.terms?.isChecked && (
                <Text allowFontScaling={false} className="text-red-500 text-sm">
                  {errors.terms.isChecked.message}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View className=" bottom-8 w-full items-center">
          <TouchableOpacity
            className={clsx(
              ' w-full rounded-[12px] bg-primario py-3 items-center   ',
              isTermsChecked ? 'opacity-100' : 'opacity-50',
              isSmall && 'max-w-[140px]',
              isMedium && 'max-w-[160px]',
              isLarge && 'max-w-[180px]'
            )}
            onPress={handleSubmit(onSubmit)}
            disabled={!isTermsChecked || isSubmitting || loading}
          >
            <Text
              allowFontScaling={false}
              maxFontSizeMultiplier={1}
              className={clsx(
                'font-semibold text-white',
                isSmall && 'text-xl leading-snug',
                isMedium && 'text-2xl leading-tight',
                isLarge && 'text-2xl leading-tight'
              )}
            >
              {isSubmitting || loading ? 'Cadastrando...' : 'Cadastre-se'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {loading && <LoadingOverlay />}
    </View>
  );
}
