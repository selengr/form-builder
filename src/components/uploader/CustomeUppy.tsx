import { styled } from '@mui/material';
import { Dashboard } from '@uppy/react';

const CustomUppy = styled(Dashboard)(() => ({
  '*': { boxSizing: 'border-box !important' },
  width: '100%',
  height: '100%',
  '& button.uppy-DashboardContent-back': {
    border: '1px solid #e32437',
    color: '#e32437',
  },
  '& .uppy-Root': {
    width: '100%',
    height: '130px',
    maxHeight: '150px !important',
    textAlign: 'right',
    '*': { fontFamily: 'inherit' },
    '& .uppy-Dashboard': {
      width: '100%',
      height: '100%',
      '& .uppy-Dashboard-inner': {
        '& .uppy-Dashboard-innerWrap': {
          '& .uppy-DashboardContent-bar': {
            display: 'none',
          },
          '& .uppy-Dashboard-files': {
            overflow: 'hidden !important',
            '& .uppy-Dashboard-filesInner': {
              '& .uppy-Dashboard-Item.is-inprogress.is-error': {
                '& .uppy-Dashboard-Item-fileInfoAndButtons': {
                  '& .uppy-Dashboard-Item-fileInfo': {
                    '& .uppy-Dashboard-Item-fileName': {
                      '& .uppy-u-reset.uppy-c-btn.uppy-Dashboard-Item-errorDetails': {
                        display: 'none',
                      },
                    },
                  },
                },
              },
            },
          },
          '& .uppy-Dashboard-progressindicators': {
            '& .uppy.uppy-Informer': {
              display: 'hidden',
              '& .uppy-Informer-animated': {
                '& .alert': {
                  '& span': {
                    display: 'none',
                  },
                },
              },
            },
            '& .uppy-StatusBar.is-error': {
              display: 'flex',
              flexDirection: 'row-reverse',
              '& .uppy-StatusBar-actions': {
                '& .uppy-u-reset.uppy-StatusBar-actionCircleBtn': {
                  display: 'none',
                },
                '& .uppy-u-reset.uppy-c-btn.uppy-StatusBar-actionBtn.uppy-StatusBar-actionBtn--retry':
                  {
                    direction: 'rtl',
                  },
              },
              '& .uppy-StatusBar-content': {
                padding: '0',
                '& svg': {
                  display: 'none',
                },
                '& .uppy-StatusBar-status': {
                  '& .uppy-StatusBar-statusSecondary': {
                    display: 'none',
                  },
                  '& .uppy-StatusBar-statusPrimary': {
                    '& .uppy-u-reset.uppy-StatusBar-details': {
                      display: 'none',
                    },
                  },
                },
              },
            },
          },
        },
        '& .uppy-Dashboard-AddFiles': {
          height: '60px',
        },
        color: 'black',
        backgroundColor: 'transparent',
        border: 'none',
        '& .uppy-StatusBar.is-uploading': {
          display: 'flex',
          justifyContent: 'flex-end',
        },
        '& .uppy-StatusBar.is-complete': {
          display: 'flex',
          justifyContent: 'center',
          '& button.uppy-u-reset.uppy-c-btn.uppy-StatusBar-actionBtn.uppy-StatusBar-actionBtn--done':
            {
              display: 'none',
            },
        },
        width: '100% !important',
        minHeight: '100% !important',
        '& .uppy-Dashboard-files-list': {
          padding: 0,
          flex: 0.8,
          '& .uppy-Dashboard-Item': {
            float: 'right',
            '@media (max-width:770px)': {
              display: 'flex',
              width: '100%',
            },
          },
          '& .uppy-Dashboard-filesInner': {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            '& .uppy-Dashboard-Item.is-resumable': {
              '& .uppy-Dashboard-Item-fileInfoAndButtons': {
                '& .uppy-Dashboard-Item-fileInfo': {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              },
            },
          },
        },
        '& .uppy-DashboardContent-panel': {
          backgroundColor: 'inherit',
          '&#uppy-DashboardContent-panel--Webcam': {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          },
          '&#uppy-DashboardContent-panel--editor': {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            '& .uppy-ImageCropper-container': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          },
        },
      },
      '& .uppy-Dashboard-AddFiles-title': {
        textAlign: 'center',
      },
      '& .uppy-DashboardTab button': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      '& .uppy-Dashboard-AddFiles-info': {
        display: 'none',
      },
    },
  },
}));

export default CustomUppy;
